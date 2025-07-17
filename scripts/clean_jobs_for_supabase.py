import csv
import json

INPUT_FILE = 'jobs_supabase.csv'
OUTPUT_FILE = 'jobs_supabase_clean.csv'

with open(INPUT_FILE, newline='') as infile, open(OUTPUT_FILE, 'w', newline='') as outfile:
    reader = csv.DictReader(infile)
    fieldnames = reader.fieldnames
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    writer.writeheader()
    for row in reader:
        # Fix requirements and tags columns to be valid JSON arrays
        for col in ['requirements', 'tags']:
            try:
                val = json.loads(row[col].replace("'", '"')) if row[col] else []
                row[col] = json.dumps(val)
            except Exception:
                row[col] = '[]'
        # Fix booleans
        for col in ['remote_friendly', 'government_job']:
            if row[col] == '1':
                row[col] = 'true'
            elif row[col] == '0':
                row[col] = 'false'
            elif row[col] == '':
                row[col] = ''
        writer.writerow(row) 