import 'dotenv/config';
import assert from 'node:assert/strict';
const errors=[];
const required=['DATABASE_URL','JWT_SECRET','CLIENT_ORIGINS','PUBLIC_API_URL','PUBLIC_WEB_URL','VITE_API_BASE_URL'];
for(const name of required)if(!process.env[name])errors.push(`${name}: falta configurar`);
if(process.env.JWT_SECRET&&process.env.JWT_SECRET.length<32)errors.push('JWT_SECRET: debe tener al menos 32 caracteres');
const parse=(name,allowLocal=false)=>{const value=process.env[name];if(!value)return null;try{const url=new URL(value);if(url.protocol!=='https:'&&!(allowLocal&&['localhost','127.0.0.1'].includes(url.hostname)))errors.push(`${name}: requiere HTTPS`);if(url.username||url.password||url.search||url.hash)errors.push(`${name}: no debe incluir credenciales ni parámetros`);return url}catch{errors.push(`${name}: URL inválida`);return null}};
const api=parse('PUBLIC_API_URL'),web=parse('PUBLIC_WEB_URL'),vite=parse('VITE_API_BASE_URL');
if(api&&vite&&api.origin+api.pathname.replace(/\/$/,'')!==vite.origin+vite.pathname.replace(/\/$/,''))errors.push('VITE_API_BASE_URL debe coincidir con PUBLIC_API_URL');
if(api&&api.pathname.replace(/\/$/,'')!=='/api')errors.push('PUBLIC_API_URL debe terminar en /api');
if(web&&web.pathname!=='/')errors.push('PUBLIC_WEB_URL debe apuntar a la raíz del sitio');
const origins=(process.env.CLIENT_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean);
if(web&&!origins.includes(web.origin))errors.push('CLIENT_ORIGINS debe incluir el origen de PUBLIC_WEB_URL');
for(const origin of origins){const parsed=parseOrigin(origin);if(!parsed)errors.push('CLIENT_ORIGINS contiene un origen inválido o no HTTPS')}
function parseOrigin(value){try{const u=new URL(value);return u.protocol==='https:'&&u.origin===value}catch{return false}}
if(process.env.MP_PAYMENTS_ENABLED==='true')errors.push('MP_PAYMENTS_ENABLED debe permanecer desactivado hasta verificar pagos y webhooks en sandbox');
if(errors.length){console.error('Configuración de despliegue pendiente:\n'+errors.map(x=>' - '+x).join('\n'));process.exitCode=1}else console.log('PASS configuración pública de despliegue consistente; pagos no habilitados');
