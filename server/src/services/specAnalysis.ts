import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { specsDir } from '../config/paths';
import { SpecAnalysis } from '../typeorm/entities/SpecAnalysis';
import { getAppDataSource } from '../typeorm/dataSource';
import { llmGenerate } from './llmProvider';

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

    // AI agent call using local LLM provider with OpenAI fallback
    const aiResult = await callExtractSpecExcelAgent(jsonInput);

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

async function callExtractSpecExcelAgent(jsonInput: { sheetName: string; columns: string[]; rows: Array<Record<string, any>> }) {
  const promptPath = locatePromptFile();
  let basePrompt = '';
  if (promptPath) {
    try { basePrompt = await fs.promises.readFile(promptPath, 'utf8'); } catch { basePrompt = ''; }
  }

  const systemPrompt = `${basePrompt}\n\nRules:\n- Detect HTTP method (GET, POST, PUT, DELETE).\n- Ask before assumptions.\n- Output Markdown with exactly 8 columns and sections.\n- Respond in English with brief Thai in descriptions.\n\nCRITICAL: Output only valid minified JSON with keys: url, method, entity, markdown.`;
  const userPrompt = `Excel sheet JSON input (single sheet):\n\n${JSON.stringify(jsonInput)}\n\nReturn only JSON as specified above.`;

  const result = await llmGenerate({ systemPrompt, userPrompt });
  const parsed = safeParseFirstJson(result.text);
  if (!parsed || !parsed.url || !parsed.method || !parsed.markdown) {
    throw new Error('AI response missing required fields');
  }
  return {
    url: parsed.url,
    method: parsed.method,
    entity: parsed.entity || jsonInput.sheetName,
    markdown: parsed.markdown,
    jsonRaw: jsonInput,
  };
}

function locatePromptFile(): string | null {
  const candidates = [
    path.resolve(process.cwd(), 'PROMPTS', 'extract-spec-excel.md'),
    path.resolve(process.cwd(), '..', 'PROMPTS', 'extract-spec-excel.md'),
    path.resolve(__dirname, '..', '..', 'PROMPTS', 'extract-spec-excel.md'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function safeParseFirstJson(text: string): any | null {
  try {
    return JSON.parse(text);
  } catch {}
  const codeBlock = text.match(/```(?:json)?\n([\s\S]*?)\n```/i);
  if (codeBlock) {
    try { return JSON.parse(codeBlock[1]); } catch {}
  }
  const loose = text.match(/\{[\s\S]*\}/);
  if (loose) {
    try { return JSON.parse(loose[0]); } catch {}
  }
  return null;
}
