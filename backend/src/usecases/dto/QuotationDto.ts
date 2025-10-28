export interface QuotationItemRequestDto {
  id?: string;
  name: string;
  qty: number;
  price: number;
  nameEn?: string | null;
}

export interface CreateQuotationRequestDto {
  companyName: string;
  clientName: string;
  includeVat: boolean;
  items: QuotationItemRequestDto[];
  note?: string | null;
}

export interface UpdateQuotationRequestDto extends CreateQuotationRequestDto {}

export interface QuotationSummaryDto {
  id: string;
  companyName: string;
  clientName: string;
  includeVat: boolean;
  total: number;
  createdAt: string;
}

export interface QuotationItemDto {
  id: string;
  name: string;
  qty: number;
  price: number;
  total: number;
}

export interface QuotationDetailDto {
  id: string;
  companyName: string;
  clientName: string;
  includeVat: boolean;
  note?: string | null;
  subtotal: number;
  vatAmount: number;
  total: number;
  items: QuotationItemDto[];
  createdAt: string;
  updatedAt: string;
}

export interface QuotationShareResponseDto {
  publicUrl: string;
}
