import pg from 'pg';
export const pool=new pg.Pool({connectionString:process.env.DATABASE_URL||'postgresql://localhost/hospeda'});
export const q=(text,params=[])=>pool.query(text,params);
