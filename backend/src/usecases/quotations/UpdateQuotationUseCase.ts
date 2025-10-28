import { IQuotationRepository } from '../../domain/repositories';
import { UpdateQuotationRequestDto } from '../dto';

export interface UpdateQuotationInput {
  userId: string;
  quotationId: string;
  payload: UpdateQuotationRequestDto;
}

export class UpdateQuotationUseCase {
  constructor(private quotationRepository: IQuotationRepository) {}

  async execute({ userId, quotationId, payload }: UpdateQuotationInput): Promise<void> {
    const existing = await this.quotationRepository.findById(quotationId, { userId });

    if (!existing) {
      throw new Error('Quotation not found');
    }

    if (!existing.isOwnedBy(userId)) {
      throw new Error('Access denied');
    }

    const updated = existing.updateDetails({
      companyName: payload.companyName,
      clientName: payload.clientName,
      note: payload.note,
      includeVat: payload.includeVat,
      items: payload.items.map((item) => ({
        id: item.id,
        name: item.name,
        nameEn: item.nameEn,
        qty: item.qty,
        price: item.price,
      })),
    });

    await this.quotationRepository.update(updated);
  }
}
