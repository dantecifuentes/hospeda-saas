// Unpaid public requests expire after 48h; requests with recorded collections require human review.
export const EXPIRE_SQL="update reservations r set status='expired' where r.source='direct_web' and r.status='pending' and r.created_at < now()-interval '48 hours' and not exists (select 1 from payments p where p.reservation_id=r.id and p.status='approved' and p.payment_kind<>'refund')";
