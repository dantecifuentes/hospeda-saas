import jwt from 'jsonwebtoken';import{JWT_SECRET}from'../config/env.js';
export function auth(req,res,next){try{const raw=req.headers.authorization||'';if(!raw.startsWith('Bearer '))throw Error();req.user=jwt.verify(raw.slice(7),JWT_SECRET);next()}catch{return res.status(401).json({error:'No autorizado'})}}
