export const dateKey=date=>date.toISOString().slice(0,10);
export const addDays=(day,count)=>{const [y,m,d]=day.split('-').map(Number);return dateKey(new Date(Date.UTC(y,m-1,d+count)))};
export const activeReservation=r=>!['cancelled','rejected','expired'].includes(r.status);
export const coversDay=(item,day,start='checkIn',end='checkOut')=>String(item[start]).slice(0,10)<=day&&String(item[end]).slice(0,10)>day;
export const channelName={manual:'Otro / manual',whatsapp:'WhatsApp',direct_web:'Web propia',hospeda_marketplace:'Hospeda',airbnb:'Airbnb (manual)',booking:'Booking.com (manual)'};
export const rangeAvailable=(cabinId,checkIn,checkOut,reservations,blocks)=>checkOut>checkIn&&!reservations.some(r=>r.cabinId===cabinId&&activeReservation(r)&&String(r.checkIn).slice(0,10)<checkOut&&String(r.checkOut).slice(0,10)>checkIn)&&!blocks.some(b=>b.cabin_id===cabinId&&String(b.check_in).slice(0,10)<checkOut&&String(b.check_out).slice(0,10)>checkIn);
export const calendarStats=(cabins,dates,reservations,blocks)=>{let booked=0,blocked=0;for(const cabin of cabins)for(const day of dates){if(reservations.some(r=>r.cabinId===cabin.id&&activeReservation(r)&&coversDay(r,day)))booked++;else if(blocks.some(b=>b.cabin_id===cabin.id&&coversDay(b,day,'check_in','check_out')))blocked++}return{booked,blocked,free:cabins.length*dates.length-booked-blocked,total:cabins.length*dates.length}};
