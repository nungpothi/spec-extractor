import { IQuotationRepository } from '../../domain/repositories';

export interface GenerateQuotationPdfInput {
  quotationId: string;
  userId: string;
}

export interface GenerateQuotationPdfResult {
  fileName: string;
  buffer: Buffer;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
  }).format(value);
};

const escapePdfText = (text: string): string => {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
};

const buildPdfBuffer = (lines: string[]): Buffer => {
  const contentLines: string[] = ['BT'];
  let isFirst = true;

  lines.forEach((line) => {
    if (isFirst) {
      contentLines.push('/F1 18 Tf');
      contentLines.push('50 800 Td');
      contentLines.push(`(${escapePdfText(line)}) Tj`);
      contentLines.push('0 -26 Td');
      contentLines.push('/F1 12 Tf');
      isFirst = false;
    } else {
      contentLines.push(`(${escapePdfText(line)}) Tj`);
      contentLines.push('0 -18 Td');
    }
  });

  contentLines.push('ET');

  const contentStream = contentLines.join('\n');
  const contentLength = Buffer.byteLength(contentStream, 'utf8');

  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n',
    `4 0 obj << /Length ${contentLength} >> stream\n${contentStream}\nendstream\nendobj\n`,
    '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n',
  ];

  const header = '%PDF-1.4\n';
  let offset = Buffer.byteLength(header, 'utf8');
  const xrefEntries: string[] = ['0000000000 65535 f \n'];

  objects.forEach((object) => {
    xrefEntries.push(`${offset.toString().padStart(10, '0')} 00000 n \n`);
    offset += Buffer.byteLength(object, 'utf8');
  });

  const body = header + objects.join('');
  const startXref = Buffer.byteLength(body, 'utf8');
  const xref = `xref\n0 ${objects.length + 1}\n${xrefEntries.join('')}`;
  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF`;

  const pdfString = `${body}${xref}${trailer}`;
  return Buffer.from(pdfString, 'utf8');
};

export class GenerateQuotationPdfUseCase {
  constructor(private quotationRepository: IQuotationRepository) {}

  async execute({ quotationId, userId }: GenerateQuotationPdfInput): Promise<GenerateQuotationPdfResult> {
    const quotation = await this.quotationRepository.findById(quotationId, { userId });

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    if (!quotation.isOwnedBy(userId)) {
      throw new Error('Access denied');
    }

    const lines: string[] = [
      'Quotation / ใบเสนอราคา',
      `Company / บริษัท: ${quotation.companyName}`,
      `Client / ลูกค้า: ${quotation.clientName}`,
    ];

    if (quotation.note) {
      lines.push(`Note / หมายเหตุ: ${quotation.note}`);
    }

    lines.push('Items / รายการสินค้า');
    quotation.items.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.nameTh} | Qty: ${item.qty} | Unit: ${formatCurrency(item.unitPrice)} | Total: ${formatCurrency(item.total)}`
      );
    });

    lines.push(`Subtotal / ยอดรวม: ${formatCurrency(quotation.subtotal)}`);
    lines.push(`VAT (${(quotation.vatRate * 100).toFixed(2)}%): ${formatCurrency(quotation.vatAmount)}`);
    lines.push(`Total / รวมสุทธิ: ${formatCurrency(quotation.total)}`);

    const buffer = buildPdfBuffer(lines);
    const fileName = `quotation-${quotation.id}.pdf`;

    return { buffer, fileName };
  }
}
