import { Router, Request, Response } from 'express';
import { getAppDataSource } from '../typeorm/dataSource';
import { SpecAnalysis } from '../typeorm/entities/SpecAnalysis';

const router = Router();

router.get('/api/spec/status/:uploadId', async (req: Request, res: Response) => {
  try {
    const { uploadId } = req.params;
    const ds = await getAppDataSource();
    const repo = ds.getRepository(SpecAnalysis);
    const rec = await repo.findOne({ where: { uploadId } });
    if (!rec) {
      return res.status(404).json({
        uploadId,
        status: 'not_found',
        totalTokens: null,
        message: 'Upload not found',
      });
    }
    return res.json({
      uploadId,
      status: rec.status,
      totalTokens: rec.totalTokens ?? null,
      message: rec.status === 'processing' ? 'Processing' : rec.status === 'done' ? 'Completed' : 'Failed',
    });
  } catch (err: any) {
    return res.status(500).json({
      uploadId: req.params?.uploadId,
      status: 'error',
      totalTokens: null,
      message: err?.message || 'Server error',
    });
  }
});

export default router;

