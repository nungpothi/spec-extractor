import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { specsDir } from '../config/paths';
import { SpecAnalysis } from '../typeorm/entities/SpecAnalysis';
import { getAppDataSource } from '../typeorm/dataSource';

export async function startSpecAnalysis(uploadId: string, projectId: string) {
  analyzeSpec(uploadId, projectId).catch((err) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] analyzeSpec failed uploadId=${uploadId}:`, err?.message || err);
  });
}

export async function analyzeSpec(uploadId: string, projectId: string) {
  const timestamp = new Date().toISOString();
  const ds = await getAppDataSource();
  const repo = ds.getRepository(SpecAnalysis);

  // Ensure a processing record exists or create it
  let record = await repo.findOne({ where: { uploadId } });
  if (!record) {
    record = repo.create({ uploadId, projectId, status: 'processing' });
    await repo.save(record);
  }

  const xlsxPath = path.join(specsDir, `${uploadId}.xlsx`);
  try {
    const jsonInput = await readExcelAsJson(xlsxPath);

    const jsonPath = path.join(specsDir, `${uploadId}.json`);
    await fs.promises.writeFile(jsonPath, JSON.stringify(jsonInput, null, 2), 'utf8');

    // Mock AI agent call (replace with real Codex CLI integration later)
    const aiResult = await mockExtractSpecExcel(jsonPath, jsonInput);

    record.status = 'done';
    record.url = aiResult.url;
    record.method = aiResult.method;
    record.markdown = aiResult.markdown;
    record.jsonRaw = aiResult.jsonRaw ?? jsonInput;
    await repo.save(record);

    const doneTs = new Date().toISOString();
    console.log(`[${doneTs}] Analysis done uploadId=${uploadId}, method=${record.method}, url=${record.url}`);

    // Optional: keep the original file; delete if desired
    // await fs.promises.unlink(xlsxPath).catch(() => {});
  } catch (err: any) {
    record.status = 'failed';
    await repo.save(record);
    const failTs = new Date().toISOString();
    console.error(`[${failTs}] Analysis failed uploadId=${uploadId}: ${err?.message || err}`);
  }
}

async function readExcelAsJson(filePath: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const firstSheet = workbook.worksheets[0];
  const sheetName = firstSheet?.name || 'Sheet1';

  // Extract header row as columns
  const headerRow = firstSheet.getRow(1);
  const columns: string[] = [];
  headerRow.eachCell({ includeEmpty: true }, (cell) => {
    const v = String(cell.value ?? '').trim();
    columns.push(v);
  });

  const rows: Array<Record<string, any>> = [];
  for (let r = 2; r <= firstSheet.rowCount; r++) {
    const row = firstSheet.getRow(r);
    if (!row || row.cellCount === 0) continue;
    const obj: Record<string, any> = {};
    for (let c = 1; c <= columns.length; c++) {
      const key = columns[c - 1] || `col_${c}`;
      const cell = row.getCell(c);
      obj[key] = cell.value;
    }
    // Skip empty rows
    const hasValue = Object.values(obj).some((v) => v !== undefined && v !== null && String(v).trim() !== '');
    if (hasValue) rows.push(obj);
  }

  return {
    sheetName,
    columns,
    rows,
  };
}

async function mockExtractSpecExcel(
  inputJsonPath: string,
  jsonInput: { sheetName: string; columns: string[]; rows: Array<Record<string, any>> }
) {
  // Very naive inference for demo purposes only
  const entity = jsonInput.sheetName.replace(/\s+/g, '-').toLowerCase();
  const method = 'GET';
  const url = `/${entity.startsWith('api') ? '' : 'api/'}v1/${entity}`.replace(/\/\//g, '/');

  const markdown = `### Header\n\n| parameter | dataType | required | possibleValues | description | dataFormat | example | errorCode |\n|---|---|---|---|---|---|---|---|\n| Authorization | string | yes | Bearer | JWT token | header | Bearer <token> | 401 |\n\n### Query String\n\n| parameter | dataType | required | possibleValues | description | dataFormat | example | errorCode |\n|---|---|---|---|---|---|---|---|\n| q | string | no | - | คำค้นหา | text | owner | - |\n\n### Response\n\n| parameter | dataType | required | possibleValues | description | dataFormat | example | errorCode |\n|---|---|---|---|---|---|---|---|\n| data | array | yes | - | รายการผลลัพธ์ | json | [] | - |`;

  return {
    url,
    method,
    entity,
    markdown,
    jsonRaw: jsonInput,
    inputJsonPath,
  };
}
