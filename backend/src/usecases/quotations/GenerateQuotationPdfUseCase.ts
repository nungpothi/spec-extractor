import path from 'path';
import { promises as fs } from 'fs';
import { IQuotationRepository } from '../../domain/repositories';
import { PdfService } from '../../services/pdf.service';

export interface GenerateQuotationPdfInput {
  quotationId: string;
  userId: string;
}

export interface GenerateQuotationPdfResult {
  fileName: string;
  buffer: Buffer;
  fileUrl: string;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
  }).format(value);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const buildTemplatePayload = (quotation: {
  id: string;
  companyName: string;
  clientName: string;
  note?: string | null;
  subtotal: number;
  vatAmount: number;
  total: number;
  vatRate: number;
  createdAt: Date;
  items: Array<{
    nameTh: string;
    qty: number;
    unitPrice: number;
    total: number;
  }>;
}) => {
  const quotationNumber = `Q-${quotation.id.slice(0, 8).toUpperCase()}`;

  return {
    title: 'ใบเสนอราคา / Quotation',
    quotationNumber,
    quotationDate: formatDate(quotation.createdAt),
    customer: {
      name: quotation.clientName,
      address: '-',
    },
    items: quotation.items.map((item, index) => ({
      index: index + 1,
      name: item.nameTh,
      qty: item.qty,
      price: formatCurrency(item.unitPrice),
      total: formatCurrency(item.total),
    })),
    grandTotal: formatCurrency(quotation.total),
    note: quotation.note,
    footerRemark: `รวมภาษีมูลค่าเพิ่ม ${(quotation.vatRate * 100).toFixed(2)}% | สร้างเมื่อ ${formatDate(new Date())}`,
  };
};

export class GenerateQuotationPdfUseCase {
  constructor(
    private quotationRepository: IQuotationRepository,
    private pdfService: PdfService,
  ) {}

  async execute({ quotationId, userId }: GenerateQuotationPdfInput): Promise<GenerateQuotationPdfResult> {
    const quotation = await this.quotationRepository.findById(quotationId, { userId });

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    if (!quotation.isOwnedBy(userId)) {
      throw new Error('Access denied');
    }

    const templateData = buildTemplatePayload(quotation);
    const { filePath, fileUrl } = await this.pdfService.generate({
      template: 'quotation',
      data: templateData,
    });

    const buffer = await fs.readFile(filePath);
    const fileName = path.basename(filePath);

    return { buffer, fileName, fileUrl };
  }
}
