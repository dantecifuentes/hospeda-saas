export const dateKey=date=>date.toISOString().slice(0,10);
export const addDays=(day,count)=>{const [y,m,d]=day.split('-').map(Number);return dateKey(new Date(Date.UTC(y,m-1,d+count)))};
export const activeReservation=r=>!['cancelled','rejected','finished','expired'].includes(r.status);
export const coversDay=(item,day,start='checkIn',end='checkOut')=>String(item[start]).slice(0,10)<=day&&String(item[end]).slice(0,10)>day;
export const channelName={manual:'Otro / manual',whatsapp:'WhatsApp',direct_web:'Web propia',hospeda_marketplace:'Hospeda',airbnb:'Airbnb (manual)',booking:'Booking.com (manual)'};
