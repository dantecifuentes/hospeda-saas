import jwt from'jsonwebtoken';import{JWT_SECRET}from'../config/env.js';export const token=u=>jwt.sign({sub:u.id,org:u.organization_id,role:u.role},JWT_SECRET,{expiresIn:'7d'});
