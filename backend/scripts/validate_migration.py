from pathlib import Path
import re

root = Path(__file__).resolve().parents[2]
files = sorted((root / "supabase/migrations").glob("*.sql"))
if not files:
    raise SystemExit("No Supabase migration files found")
for path in files:
    sql = path.read_text()
    if sql.count("$$") % 2:
        raise SystemExit(f"Unbalanced dollar-quoted function delimiters: {path}")
    if re.search(r"\bas\s+\$(?!\$)", sql):
        raise SystemExit(f"Invalid single-dollar function delimiter: {path}")
    if "begin;" not in sql.lower() or "commit;" not in sql.lower():
        raise SystemExit(f"Migration must be transactional: {path}")
print(f"Static migration checks passed for {len(files)} file(s).")
