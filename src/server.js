const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_ROOT = path.resolve(__dirname, '..', 'data', 'uploads', 'specs');
const ALLOWED_EXTENSIONS = new Set(['.xlsx', '.xls']);

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    if (ALLOWED_EXTENSIONS.has(extension)) {
      cb(null, true);
    } else {
      const error = new Error('INVALID_FILE_TYPE');
      error.code = 'INVALID_FILE_TYPE';
      cb(error);
    }
  }
});

async function ensureUploadDirectory() {
  await fs.mkdir(UPLOAD_ROOT, { recursive: true });
}

function startSpecAnalysis(uploadId) {
  console.log(`Starting analysis for ${uploadId}`);
}

app.post('/api/spec/upload', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file or missing parameter.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file or missing parameter.'
      });
    }

    try {
      const projectIdInput = typeof req.body?.projectId === 'string' ? req.body.projectId.trim() : '';
      const projectId = projectIdInput || 'TEMP-PJ-001';
      const uploadId = uuidv4();
      const targetPath = path.join(UPLOAD_ROOT, `${uploadId}.xlsx`);

      await fs.writeFile(targetPath, req.file.buffer);
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Saved upload ${req.file.originalname} as ${targetPath}`);

      setImmediate(() => startSpecAnalysis(uploadId));

      return res.status(200).json({
        success: true,
        uploadId,
        projectId,
        message: 'File received and processing started.'
      });
    } catch (writeError) {
      console.error('Failed to store uploaded file:', writeError);
      return res.status(500).json({
        success: false,
        message: 'Unable to store file at this time.'
      });
    }
  });
});

async function startServer() {
  try {
    await ensureUploadDirectory();
    app.listen(PORT, () => {
      console.log(`Spec upload service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = { app };
