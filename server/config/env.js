export const PORT=Number(process.env.API_PORT||53128);
export const JWT_SECRET=process.env.JWT_SECRET||'dev-only-change-me';
export const CLIENT_ORIGINS=(process.env.CLIENT_ORIGINS||'http://localhost:53127,http://127.0.0.1:53127').split(',');
export function validateEnv(){if(process.env.NODE_ENV==='production'&&(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32))throw new Error('JWT_SECRET de al menos 32 caracteres requerido en producción')}
