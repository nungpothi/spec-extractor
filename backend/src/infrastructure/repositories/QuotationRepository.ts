import { Repository } from 'typeorm';
import {
  IQuotationRepository,
  FindQuotationOptions,
} from '../../domain/repositories';
import { Quotation, QuotationItem } from '../../domain/entities';
import { AppDataSource } from '../database/dataSource';
import { QuotationEntity, QuotationItemEntity } from '../database/entities';

const toNumber = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export class QuotationRepository implements IQuotationRepository {
  private repository: Repository<QuotationEntity>;
  private itemRepository: Repository<QuotationItemEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(QuotationEntity);
    this.itemRepository = AppDataSource.getRepository(QuotationItemEntity);
  }

  async findById(id: string, options?: FindQuotationOptions): Promise<Quotation | null> {
    const where: Record<string, unknown> = { id };
    if (options?.userId) {
      where.userId = options.userId;
    }

    const quotation = await this.repository.findOne({
      where,
    });

    if (!quotation) {
      return null;
    }

    return this.mapToDomain(quotation);
  }

  async findAllByUser(userId: string): Promise<Quotation[]> {
    const quotations = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return quotations.map((quotation) => this.mapToDomain(quotation));
  }

  async create(quotation: Quotation): Promise<Quotation> {
    const entity = this.mapToPersistence(quotation);
    const saved = await this.repository.save(entity);
    return this.mapToDomain(saved);
  }

  async update(quotation: Quotation): Promise<Quotation> {
    return this.repository.manager.transaction(async (manager) => {
      const existing = await manager.findOne(QuotationEntity, {
        where: { id: quotation.id },
      });

      if (!existing) {
        throw new Error('Quotation not found');
      }

      await manager.delete(QuotationItemEntity, { quotationId: quotation.id });

      await manager.update(QuotationEntity, quotation.id, {
        companyName: quotation.companyName,
        clientName: quotation.clientName,
        note: quotation.note ?? null,
        includeVat: quotation.includeVat,
        vatRate: quotation.vatRate,
        subtotal: quotation.subtotal,
        vatAmount: quotation.vatAmount,
        total: quotation.total,
        shareId: quotation.shareId ?? null,
        updatedAt: new Date(),
      });

      const itemEntities = quotation.items.map((item) =>
        manager.create(QuotationItemEntity, {
          quotationId: quotation.id,
          nameTh: item.nameTh,
          nameEn: item.nameEn ?? item.nameTh,
          qty: item.qty,
          unitPrice: item.unitPrice,
          total: item.total,
        })
      );

      if (itemEntities.length > 0) {
        await manager.save(itemEntities);
      }

      const reloaded = await manager.findOne(QuotationEntity, {
        where: { id: quotation.id },
      });

      if (!reloaded) {
        throw new Error('Failed to reload quotation after update');
      }

      return this.mapToDomain(reloaded);
    });
  }

  private mapToDomain(entity: QuotationEntity): Quotation {
    const items = (entity.items ?? []).map((item) =>
      QuotationItem.restore({
        id: item.id,
        nameTh: item.nameTh,
        nameEn: item.nameEn,
        qty: item.qty,
        unitPrice: toNumber(item.unitPrice),
        total: toNumber(item.total),
      })
    );

    return Quotation.restore({
      id: entity.id,
      userId: entity.userId,
      companyName: entity.companyName,
      clientName: entity.clientName,
      note: entity.note,
      includeVat: entity.includeVat,
      vatRate: toNumber(entity.vatRate),
      subtotal: toNumber(entity.subtotal),
      vatAmount: toNumber(entity.vatAmount),
      total: toNumber(entity.total),
      items,
      shareId: entity.shareId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private mapToPersistence(quotation: Quotation): QuotationEntity {
    const entity = this.repository.create({
      id: quotation.id,
      userId: quotation.userId,
      companyName: quotation.companyName,
      clientName: quotation.clientName,
      note: quotation.note ?? null,
      includeVat: quotation.includeVat,
      vatRate: quotation.vatRate,
      subtotal: quotation.subtotal,
      vatAmount: quotation.vatAmount,
      total: quotation.total,
      shareId: quotation.shareId ?? null,
      createdAt: quotation.createdAt,
      updatedAt: quotation.updatedAt,
      items: quotation.items.map((item) =>
        this.itemRepository.create({
          quotationId: quotation.id,
          nameTh: item.nameTh,
          nameEn: item.nameEn ?? item.nameTh,
          qty: item.qty,
          unitPrice: item.unitPrice,
          total: item.total,
        })
      ),
    });

    return entity;
  }
}
