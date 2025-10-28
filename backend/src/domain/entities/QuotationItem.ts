import { v4 as uuidv4 } from 'uuid';

const roundCurrency = (value: number): number => {
  return Math.round(value * 100) / 100;
};

export interface QuotationItemProps {
  id: string;
  nameTh: string;
  nameEn?: string | null;
  qty: number;
  unitPrice: number;
  total: number;
}

export class QuotationItem {
  public readonly id: string;
  public readonly nameTh: string;
  public readonly nameEn?: string | null;
  public readonly qty: number;
  public readonly unitPrice: number;
  public readonly total: number;

  constructor({ id, nameTh, nameEn, qty, unitPrice, total }: QuotationItemProps) {
    this.id = id;
    this.nameTh = nameTh;
    this.nameEn = nameEn;
    this.qty = qty;
    this.unitPrice = unitPrice;
    this.total = total;
  }

  static create({
    id,
    nameTh,
    nameEn,
    qty,
    unitPrice,
  }: {
    id?: string;
    nameTh: string;
    nameEn?: string | null;
    qty: number;
    unitPrice: number;
  }): QuotationItem {
    const normalizedNameTh = nameTh.trim();
    if (!normalizedNameTh) {
      throw new Error('Item description is required');
    }

    const normalizedQty = Number.isFinite(qty) && qty > 0 ? qty : 0;
    const normalizedUnitPrice = Number.isFinite(unitPrice) && unitPrice >= 0 ? unitPrice : 0;

    const total = roundCurrency(normalizedQty * normalizedUnitPrice);

    return new QuotationItem({
      id: id ?? uuidv4(),
      nameTh: normalizedNameTh,
      nameEn: nameEn ?? normalizedNameTh,
      qty: normalizedQty,
      unitPrice: roundCurrency(normalizedUnitPrice),
      total,
    });
  }

  static restore(props: QuotationItemProps): QuotationItem {
    return new QuotationItem(props);
  }
}
