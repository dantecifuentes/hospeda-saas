ALTER TABLE operations_tasks ADD COLUMN IF NOT EXISTS assigned_name text NOT NULL DEFAULT '' CHECK(length(assigned_name)<=120);
ALTER TABLE operations_tasks ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal' CHECK(priority IN ('low','normal','high','urgent'));
ALTER TABLE operations_tasks ADD COLUMN IF NOT EXISTS notes text NOT NULL DEFAULT '' CHECK(length(notes)<=1000);
