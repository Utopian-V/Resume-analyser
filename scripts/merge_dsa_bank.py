import os
import csv

BANK_DIR = 'frontend/src/data/dsa-bank'
OUTPUT_CSV = 'frontend/src/data/dsa_questions.csv'

# Map sheet file names to category names
category_map = {
    'VanshDSA - Arrays.csv': 'Arrays',
    'VanshDSA - String.csv': 'Strings',
    'VanshDSA - Matrix.csv': 'Matrix',
    'VanshDSA - Searching and Sorting.csv': 'Searching and Sorting',
    'VanshDSA - LinkedList.csv': 'Linked List',
    'VanshDSA - Binary Tree.csv': 'Binary Tree',
    'VanshDSA - Binary Search tree.csv': 'Binary Search Tree',
    'VanshDSA - Greedy.csv': 'Greedy',
    'VanshDSA - Backtracing.csv': 'Backtracking',
    'VanshDSA - Stack and Queue.csv': 'Stack and Queue',
    'VanshDSA - Dynamic Programming.csv': 'Dynamic Programming',
    'VanshDSA - Bit Manipulation.csv': 'Bit Manipulation',
    'VanshDSA - trie.csv': 'Trie',
}

# Output columns
columns = ['category', 'title', 'status', 'brief']

rows = []
for fname in os.listdir(BANK_DIR):
    if not fname.endswith('.csv'):
        continue
    category = category_map.get(fname, os.path.splitext(fname)[0])
    with open(os.path.join(BANK_DIR, fname), encoding='utf-8') as f:
        reader = csv.reader(f)
        headers = next(reader)
        # Find column indices
        problem_idx = next((i for i, h in enumerate(headers) if 'problem' in h.lower()), 0)
        status_idx = next((i for i, h in enumerate(headers) if 'status' in h.lower()), 1)
        brief_idx = next((i for i, h in enumerate(headers) if 'remark' in h.lower() or 'brief' in h.lower() or 'notes' in h.lower()), None)
        for row in reader:
            if not row or not row[problem_idx].strip():
                continue
            title = row[problem_idx].strip()
            status = row[status_idx].strip() if len(row) > status_idx else 'unsolved'
            brief = row[brief_idx].strip() if brief_idx is not None and len(row) > brief_idx else ''
            # Normalize status
            status_map = {
                'done': 'solved',
                'yet to do': 'unsolved',
                "couldn't solve": 'attempted',
                'solve again': 'attempted',
            }
            status_norm = status_map.get(status.lower(), status.lower())
            rows.append({
                'category': category,
                'title': title,
                'status': status_norm,
                'brief': brief
            })

# Remove duplicates (by category+title)
seen = set()
clean_rows = []
for row in rows:
    key = (row['category'].lower(), row['title'].lower())
    if key in seen:
        continue
    seen.add(key)
    clean_rows.append(row)

with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=columns)
    writer.writeheader()
    for row in clean_rows:
        writer.writerow(row)

print(f"Merged {len(clean_rows)} questions into {OUTPUT_CSV}") 