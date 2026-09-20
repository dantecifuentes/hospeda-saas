import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const base=process.env.HOSPEDA_DEMO_API||'http://127.0.0.1:53130/api';
if(!/^http:\/\/(127\.0\.0\.1|localhost):\d+\/api$/.test(base))throw Error('La demo solo puede ejecutarse contra Hospeda local');
const id=crypto.randomBytes(4).toString('hex'),email=`demo-${id}@hospeda.test`,password=crypto.randomBytes(18).toString('base64url');
let token;
async function request(route,method='GET',body){const r=await fetch(base+route,{method,headers:{...(body?{'content-type':'application/json'}:{}),...(token?{authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();if(!r.ok)throw Error(`${method} ${route}: HTTP ${r.status} ${JSON.stringify(data)}`);return data}
const org=await request('/auth/register','POST',{name:'Administrador Demo',email,password,company:'Hospeda Demo 10 '+id,location:'Pucón',description:'Datos ficticios para demostración, sin huéspedes reales',depositPercent:50});token=org.token;
const names=['Lago Azul','Bosque Nativo','Volcán','Araucaria','Mirador','Río Claro','Coihue','Arrayán','Piedra Alta','Estrella Sur'];
const cabins=[];for(let i=0;i<names.length;i++)cabins.push(await request('/cabins','POST',{name:'Cabaña '+names[i],type:'Cabaña',capacity:2+i%5,rate:65000+i*5000,description:'Alojamiento de demostración · datos ficticios'}));
const cabinId=cabins[0].id;await request('/pricing/cabins/'+cabinId,'PATCH',{minNights:2});await request('/pricing/cabins/'+cabinId+'/rules','POST',{startDate:'2027-02-01',endDate:'2027-03-01',nightlyRate:125000,label:'Verano'});
const sources=['whatsapp','booking','airbnb','manual','direct_web'];let booked=0,paid=0;for(let i=0;i<cabins.length;i++){for(let j=0;j<2;j++){const day=String(2+j*10).padStart(2,'0'),end=String(5+j*10).padStart(2,'0'),total=(i===0?125000:65000+i*5000)*3;const reservation=await request('/reservations','POST',{cabinId:cabins[i].id,guest:`Huésped Ficticio ${i+1}-${j+1}`,phone:'',checkIn:`2027-02-${day}`,checkOut:`2027-02-${end}`,people:2,source:sources[(i+j)%sources.length],sourceReference:`DEMO-${id}-${i}-${j}`,total});booked++;await request('/reservations/'+reservation.id+'/payments','POST',{amount:Math.round(total/2)});paid++;if((i+j)%3===0)await request('/operations/reservations/'+reservation.id+'/commission','PATCH',{amount:Math.round(total*.12)})}await request('/operations/expenses','POST',{cabinId:cabins[i].id,date:'2027-02-10',category:'Limpieza',description:'Gasto ficticio',amount:18000+i*1000})}
const result=await request('/reservations');assert.equal(result.length,20);assert.equal((await request('/cabins')).length,10);assert.equal((await request('/operations/expenses')).length,10);
const dir=path.join(os.homedir(),'.config','hospeda');fs.mkdirSync(dir,{recursive:true,mode:0o700});const file=path.join(dir,'demo-ten-cabins-'+id+'.json');fs.writeFileSync(file,JSON.stringify({url:base.replace(/\/api$/,''),email,password,company:org.organization.name,organizationId:org.organization.id,cabins:10,reservations:booked,payments:paid},null,2),{mode:0o600});console.log(`DEMO_OK cabins=10 reservations=${booked} payments=${paid} expenses=10`);console.log(`CREDENTIALS_FILE=${file}`);
