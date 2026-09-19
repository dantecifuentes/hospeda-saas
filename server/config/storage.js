import path from'node:path';import fs from'node:fs';
export const STORAGE_DIR=path.resolve(process.env.STORAGE_DIR||'uploads');
export const PUBLIC_API_URL=(process.env.PUBLIC_API_URL||`http://localhost:${process.env.API_PORT||53128}/api`).replace(/\/$/,'');
export const PUBLIC_UPLOAD_URL=PUBLIC_API_URL.replace(/\/api$/,'')+'/uploads';
fs.mkdirSync(STORAGE_DIR,{recursive:true,mode:0o750});
