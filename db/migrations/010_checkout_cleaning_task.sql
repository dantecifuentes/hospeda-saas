CREATE UNIQUE INDEX IF NOT EXISTS operations_tasks_checkout_cleaning_unique ON operations_tasks(reservation_id,type) WHERE reservation_id IS NOT NULL AND type='cleaning';
