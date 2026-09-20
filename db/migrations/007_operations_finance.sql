ALTER TABLE reservations ADD COLUMN IF NOT EXISTS checked_in_at timestamptz;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS checked_out_at timestamptz;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS channel_commission integer NOT NULL DEFAULT 0 CHECK(channel_commission>=0);
CREATE TABLE IF NOT EXISTS operating_expenses(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,cabin_id uuid REFERENCES cabins(id),expense_date date NOT NULL,category text NOT NULL CHECK(length(category) BETWEEN 2 AND 80),description text NOT NULL DEFAULT '',amount integer NOT NULL CHECK(amount>0),created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS operating_expenses_org_date_idx ON operating_expenses(organization_id,expense_date);
