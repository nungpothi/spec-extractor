import fs from 'fs';
import path from 'path';

export const baseDataDir = path.resolve(process.cwd(), 'data');
export const uploadsDir = path.join(baseDataDir, 'uploads');
export const specsDir = path.join(uploadsDir, 'specs');
export const clientBuildPath = path.resolve(process.cwd(), 'client', 'build');

for (const dir of [baseDataDir, uploadsDir, specsDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

