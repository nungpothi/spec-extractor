import { Quotation } from '../entities';

export interface FindQuotationOptions {
  userId?: string;
  includeItems?: boolean;
}

export interface IQuotationRepository {
  findById(id: string, options?: FindQuotationOptions): Promise<Quotation | null>;
  findAllByUser(userId: string): Promise<Quotation[]>;
  create(quotation: Quotation): Promise<Quotation>;
  update(quotation: Quotation): Promise<Quotation>;
}
