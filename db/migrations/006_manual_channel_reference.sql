ALTER TABLE reservations ADD COLUMN IF NOT EXISTS source_reference text NOT NULL DEFAULT '';
ALTER TABLE reservations ADD CONSTRAINT reservations_source_reference_length CHECK (char_length(source_reference)<=160);
