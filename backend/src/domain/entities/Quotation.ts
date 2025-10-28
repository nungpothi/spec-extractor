import { v4 as uuidv4 } from 'uuid';
import { QuotationItem } from './QuotationItem';

const DEFAULT_VAT_RATE = 0.07;

const roundCurrency = (value: number): number => {
  return Math.round(value * 100) / 100;
};

export interface QuotationProps {
  id: string;
  userId: string;
  companyName: string;
  clientName: string;
  note?: string | null;
  includeVat: boolean;
  vatRate: number;
  subtotal: number;
  vatAmount: number;
  total: number;
  items: QuotationItem[];
  shareId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Quotation {
  public readonly id: string;
  public readonly userId: string;
  public readonly companyName: string;
  public readonly clientName: string;
  public readonly note?: string | null;
  public readonly includeVat: boolean;
  public readonly vatRate: number;
  public readonly subtotal: number;
  public readonly vatAmount: number;
  public readonly total: number;
  public readonly items: QuotationItem[];
  public readonly shareId?: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: QuotationProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.companyName = props.companyName;
    this.clientName = props.clientName;
    this.note = props.note;
    this.includeVat = props.includeVat;
    this.vatRate = props.vatRate;
    this.subtotal = props.subtotal;
    this.vatAmount = props.vatAmount;
    this.total = props.total;
    this.items = props.items;
    this.shareId = props.shareId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create({
    userId,
    companyName,
    clientName,
    note,
    includeVat,
    items,
    vatRate = DEFAULT_VAT_RATE,
  }: {
    userId: string;
    companyName: string;
    clientName: string;
    note?: string | null;
    includeVat: boolean;
    items: Array<{ id?: string; name: string; qty: number; price: number; nameEn?: string | null }>;
    vatRate?: number;
  }): Quotation {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const normalizedCompany = companyName.trim();
    if (!normalizedCompany) {
      throw new Error('Company name is required');
    }
    const normalizedClient = clientName.trim();
    if (!normalizedClient) {
      throw new Error('Client name is required');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('At least one item is required');
    }

    const quotationItems = items
      .filter((item) => item.name.trim() && item.qty > 0)
      .map((item) =>
        QuotationItem.create({
          id: item.id,
          nameTh: item.name,
          nameEn: item.nameEn ?? item.name,
          qty: item.qty,
          unitPrice: item.price,
        })
      );

    if (quotationItems.length === 0) {
      throw new Error('At least one valid item is required');
    }

    const subtotal = roundCurrency(
      quotationItems.reduce((sum, item) => sum + item.total, 0)
    );
    const normalizedVatRate = vatRate >= 0 ? vatRate : DEFAULT_VAT_RATE;
    const vatAmount = includeVat ? roundCurrency(subtotal * normalizedVatRate) : 0;
    const total = roundCurrency(subtotal + vatAmount);

    const now = new Date();
    return new Quotation({
      id: uuidv4(),
      userId,
      companyName: normalizedCompany,
      clientName: normalizedClient,
      note: note?.trim() ?? null,
      includeVat,
      vatRate: normalizedVatRate,
      subtotal,
      vatAmount,
      total,
      items: quotationItems,
      shareId: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: QuotationProps): Quotation {
    return new Quotation(props);
  }

  updateDetails({
    companyName,
    clientName,
    note,
    includeVat,
    items,
    vatRate = this.vatRate,
  }: {
    companyName: string;
    clientName: string;
    note?: string | null;
    includeVat: boolean;
    items: Array<{ id?: string; name: string; qty: number; price: number; nameEn?: string | null }>;
    vatRate?: number;
  }): Quotation {
    const updated = Quotation.create({
      userId: this.userId,
      companyName,
      clientName,
      note,
      includeVat,
      items,
      vatRate,
    });

    return new Quotation({
      ...updated,
      id: this.id,
      shareId: this.shareId,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  withShareId(shareId: string): Quotation {
    return new Quotation({
      ...this,
      shareId,
      updatedAt: new Date(),
    });
  }

  isOwnedBy(userId: string): boolean {
    return this.userId === userId;
  }
}
