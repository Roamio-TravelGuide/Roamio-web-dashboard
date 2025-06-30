// src/utils/fileStorage.ts
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const exists = promisify(fs.exists);

const UPLOAD_DIR = path.join(process.cwd(), 'src', 'assets', 'uploads');

export async function storeFileLocally(
  file: File | Buffer,
  filename: string,
  subfolder: 'cover-images' | 'audio' | 'images'
): Promise<string> {
  const uploadPath = path.join(UPLOAD_DIR, 'tours', subfolder);
  const filePath = path.join(uploadPath, filename);
  
  // Create directory if it doesn't exist
  if (!(await exists(uploadPath))) {
    await mkdir(uploadPath, { recursive: true });
  }

  // Handle both File objects and Buffers
  const fileData = file instanceof File 
    ? Buffer.from(await file.arrayBuffer()) 
    : file;

  await writeFile(filePath, fileData);
  
  // Return relative path for web access
  return `/assets/uploads/tours/${subfolder}/${filename}`;
}

export function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const basename = path.basename(originalName, ext);
  const timestamp = Date.now();
  return `${basename}-${timestamp}${ext}`;
}