import { v4 as uuidv4 } from 'uuid';
import { IQuotationRepository } from '../../domain/repositories';
import { QuotationShareResponseDto } from '../dto';

export interface GenerateQuotationShareLinkInput {
  quotationId: string;
  userId: string;
}

export class GenerateQuotationShareLinkUseCase {
  constructor(private quotationRepository: IQuotationRepository) {}

  async execute({ quotationId, userId }: GenerateQuotationShareLinkInput): Promise<QuotationShareResponseDto> {
    const quotation = await this.quotationRepository.findById(quotationId, { userId });

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    if (!quotation.isOwnedBy(userId)) {
      throw new Error('Access denied');
    }

    const shareId = uuidv4();

    const updated = quotation.withShareId(shareId);
    await this.quotationRepository.update(updated);

    const baseUrl = process.env.PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://app.domain.com';
    const publicUrl = `${baseUrl}/q/${shareId}`;

    return { publicUrl };
  }
}
