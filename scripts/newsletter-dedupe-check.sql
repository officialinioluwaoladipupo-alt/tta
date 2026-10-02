-- Read-only check for duplicate newsletter subscriber emails.
SELECT lower(email) AS email, COUNT(*) AS duplicate_count
FROM submissions
WHERE type = 'newsletter'
GROUP BY lower(email)
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, email;

-- After reviewing the results, this statement can be enabled to keep the earliest row per email:
-- DELETE FROM submissions s
-- WHERE s.type = 'newsletter'
--   AND s.id IN (
--     SELECT id
--     FROM (
--       SELECT id, ROW_NUMBER() OVER (PARTITION BY lower(email) ORDER BY created_at ASC, id ASC) AS row_number
--       FROM submissions
--       WHERE type = 'newsletter'
--     ) duplicates
--     WHERE row_number > 1
--   );
