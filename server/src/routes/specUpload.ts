import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { specsDir } from '../config/paths';
import { startSpecAnalysis } from '../services/specAnalysis';
import { getAppDataSource } from '../typeorm/dataSource';
import { SpecAnalysis } from '../typeorm/entities/SpecAnalysis';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedExt = ['.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext)) {
      return cb(new Error('Invalid file type. Only .xlsx or .xls allowed.'));
    }
    cb(null, true);
  },
});

router.post('/api/spec/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const timestamp = new Date().toISOString();
    const projectId = (req.body?.projectId as string) || 'TEMP-PJ-001';

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const originalName = req.file.originalname;
    const ext = path.extname(originalName).toLowerCase();
    if (!(ext === '.xlsx' || ext === '.xls')) {
      return res.status(400).json({ success: false, message: 'Invalid file type. Only .xlsx or .xls allowed.' });
    }

    const uploadId = uuidv4();
    const finalPath = path.join(specsDir, `${uploadId}.xlsx`);

    await fs.promises.writeFile(finalPath, req.file.buffer);

    console.log(`[${timestamp}] Received file name="${originalName}", uploadId=${uploadId}`);

    // Create processing record
    try {
      const ds = await getAppDataSource();
      const repo = ds.getRepository(SpecAnalysis);
      const rec = repo.create({ uploadId, projectId, status: 'processing' });
      await repo.save(rec);
    } catch (dbErr: any) {
      console.error(`[${timestamp}] Failed to persist processing record:`, dbErr?.message || dbErr);
      // proceed anyway; analysis will attempt to upsert
    }

    startSpecAnalysis(uploadId, projectId);

    return res.json({
      success: true,
      uploadId,
      projectId,
      message: 'File received and processing started.',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

export default router;
