ALTER TABLE applications
ADD COLUMN IF NOT EXISTS status_transitions JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE applications
SET status_transitions = jsonb_build_array(
  jsonb_build_object(
    'status', status,
    'transitionedAt', COALESCE(updated_at, created_at, NOW())
  )
)
WHERE status_transitions = '[]'::jsonb;
