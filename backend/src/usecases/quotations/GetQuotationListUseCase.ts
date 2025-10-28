import { IQuotationRepository } from '../../domain/repositories';
import { QuotationSummaryDto } from '../dto';

export interface GetQuotationListInput {
  userId: string;
}

export class GetQuotationListUseCase {
  constructor(private quotationRepository: IQuotationRepository) {}

  async execute({ userId }: GetQuotationListInput): Promise<QuotationSummaryDto[]> {
    const quotations = await this.quotationRepository.findAllByUser(userId);

    return quotations.map((quotation) => ({
      id: quotation.id,
      companyName: quotation.companyName,
      clientName: quotation.clientName,
      includeVat: quotation.includeVat,
      total: quotation.total,
      createdAt: quotation.createdAt.toISOString(),
    }));
  }
}
