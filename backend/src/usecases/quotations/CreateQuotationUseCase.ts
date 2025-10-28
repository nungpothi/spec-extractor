import { IQuotationRepository } from '../../domain/repositories';
import { Quotation } from '../../domain/entities';
import { CreateQuotationRequestDto } from '../dto';

export interface CreateQuotationInput {
  userId: string;
  payload: CreateQuotationRequestDto;
}

export interface CreateQuotationOutput {
  id: string;
  total: number;
}

export class CreateQuotationUseCase {
  constructor(private quotationRepository: IQuotationRepository) {}

  async execute({ userId, payload }: CreateQuotationInput): Promise<CreateQuotationOutput> {
    const quotation = Quotation.create({
      userId,
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

    const saved = await this.quotationRepository.create(quotation);

    return {
      id: saved.id,
      total: saved.total,
    };
  }
}
