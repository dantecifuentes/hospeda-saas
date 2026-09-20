ALTER TABLE reservations ADD COLUMN IF NOT EXISTS notes text NOT NULL DEFAULT '' CHECK(length(notes)<=2000);
