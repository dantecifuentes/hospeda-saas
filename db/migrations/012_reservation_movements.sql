CREATE TABLE IF NOT EXISTS reservation_movements(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 reservation_id uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
 old_cabin_id uuid NOT NULL REFERENCES cabins(id), new_cabin_id uuid NOT NULL REFERENCES cabins(id),
 old_check_in date NOT NULL, old_check_out date NOT NULL, new_check_in date NOT NULL, new_check_out date NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reservation_movements_reservation_idx ON reservation_movements(organization_id,reservation_id,created_at DESC);
