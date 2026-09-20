CREATE TABLE IF NOT EXISTS reservation_cancellations(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 reservation_id uuid NOT NULL UNIQUE REFERENCES reservations(id) ON DELETE CASCADE,
 reason text NOT NULL CHECK(length(reason) BETWEEN 2 AND 500), initiated_by text NOT NULL CHECK(initiated_by IN ('guest','owner','channel','other')),
 paid_at_cancel integer NOT NULL DEFAULT 0 CHECK(paid_at_cancel>=0), cancelled_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reservation_cancellations_org_idx ON reservation_cancellations(organization_id,cancelled_at DESC);
