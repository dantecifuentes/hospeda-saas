import assert from'node:assert/strict';
import{addDays,activeReservation,coversDay,channelName}from'../src/modules/calendarDates.js';
assert.equal(addDays('2026-12-31',1),'2027-01-01');assert.equal(addDays('2028-02-28',1),'2028-02-29');assert.equal(addDays('2026-03-01',-1),'2026-02-28');console.log('PASS calendar UTC navigation across year and leap days');
const booking={checkIn:'2026-12-24',checkOut:'2026-12-26',status:'confirmed'};assert(coversDay(booking,'2026-12-24'));assert(coversDay(booking,'2026-12-25'));assert(!coversDay(booking,'2026-12-26'));assert(!coversDay(booking,'2026-12-23'));console.log('PASS checkout day is available');
assert(activeReservation({...booking,status:'pending'}));for(const status of ['cancelled','rejected','finished','expired'])assert(!activeReservation({...booking,status}));console.log('PASS inactive bookings do not occupy calendar');
assert(coversDay({check_in:'2026-12-24',check_out:'2026-12-26'},'2026-12-25','check_in','check_out'));assert.equal(channelName.booking,'Booking.com (manual)');assert.equal(channelName.airbnb,'Airbnb (manual)');console.log('PASS manual blocks and channel labels');console.log('RESULT 4 passed 0 failed');
