import { IQuotationRepository } from '../../domain/repositories';
import { QuotationDetailDto } from '../dto';

export interface GetQuotationDetailInput {
  quotationId: string;
  userId: string;
}

export class GetQuotationDetailUseCase {
  constructor(private quotationRepository: IQuotationRepository) {}

  async execute({ quotationId, userId }: GetQuotationDetailInput): Promise<QuotationDetailDto> {
    const quotation = await this.quotationRepository.findById(quotationId, { userId });

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    if (!quotation.isOwnedBy(userId)) {
      throw new Error('Access denied');
    }

    return {
      id: quotation.id,
      companyName: quotation.companyName,
      clientName: quotation.clientName,
      includeVat: quotation.includeVat,
      note: quotation.note ?? null,
      subtotal: quotation.subtotal,
      vatAmount: quotation.vatAmount,
      total: quotation.total,
      items: quotation.items.map((item) => ({
        id: item.id,
        name: item.nameTh,
        qty: item.qty,
        price: item.unitPrice,
        total: item.total,
      })),
      createdAt: quotation.createdAt.toISOString(),
      updatedAt: quotation.updatedAt.toISOString(),
    };
  }
}
