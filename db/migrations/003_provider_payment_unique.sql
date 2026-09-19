CREATE UNIQUE INDEX IF NOT EXISTS payments_provider_id_unique ON payments(provider,provider_payment_id) WHERE provider_payment_id IS NOT NULL AND provider <> 'manual';
