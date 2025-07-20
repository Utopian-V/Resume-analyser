"""
DSA Question Bank Merger Script
Handled by: Data Team
Purpose: Merge multiple CSV files containing DSA questions into a single consolidated file

This script processes individual CSV files containing DSA questions organized by category
and merges them into a single CSV file for easier data management and import into the
application database.

The script handles:
- Multiple category files (Arrays, Strings, Matrix, etc.)
- Status normalization (done -> solved, etc.)
- Duplicate removal
- Column mapping and data cleaning
- UTF-8 encoding for international character support
"""
import os
import csv

# Configuration paths
BANK_DIR = 'frontend/src/data/dsa-bank'  # Directory containing individual category files
OUTPUT_CSV = 'frontend/src/data/dsa_questions.csv'  # Output consolidated file

# Map individual CSV file names to standardized category names
# This ensures consistent category naming across the application
category_map = {
    'VanshDSA - Arrays.csv': 'Arrays',
    'VanshDSA - String.csv': 'Strings',
    'VanshDSA - Matrix.csv': 'Matrix',
    'VanshDSA - Searching and Sorting.csv': 'Searching and Sorting',
    'VanshDSA - LinkedList.csv': 'Linked List',
    'VanshDSA - Binary Tree.csv': 'Binary Tree',
    'VanshDSA - Binary Search tree.csv': 'Binary Search Tree',
    'VanshDSA - Greedy.csv': 'Greedy',
    'VanshDSA - Backtracing.csv': 'Backtracking',  # Note: Fixed typo in mapping
    'VanshDSA - Stack and Queue.csv': 'Stack and Queue',
    'VanshDSA - Dynamic Programming.csv': 'Dynamic Programming',
    'VanshDSA - Bit Manipulation.csv': 'Bit Manipulation',
    'VanshDSA - trie.csv': 'Trie',
}

# Define output CSV structure
# These columns will be present in the final consolidated file
columns = ['category', 'title', 'status', 'brief']

def normalize_status(status):
    """
    Normalize question status to standard values.
    
    Different CSV files may use different terms for the same status.
    This function maps various status terms to standardized values.
    
    Args:
        status (str): Raw status from CSV file
        
    Returns:
        str: Normalized status (solved, unsolved, attempted)
    """
    status_map = {
        'done': 'solved',
        'yet to do': 'unsolved',
        "couldn't solve": 'attempted',
        'solve again': 'attempted',
        'solved': 'solved',
        'unsolved': 'unsolved',
        'attempted': 'attempted',
    }
    return status_map.get(status.lower(), status.lower())

def find_column_index(headers, keywords):
    """
    Find column index by searching for keywords in header names.
    
    Different CSV files may have different column names for the same data.
    This function searches for columns containing specific keywords.
    
    Args:
        headers (list): List of column headers
        keywords (list): Keywords to search for in header names
        
    Returns:
        int: Index of matching column, or None if not found
    """
    for i, header in enumerate(headers):
        if any(keyword in header.lower() for keyword in keywords):
            return i
    return None

# Main processing logic
rows = []

# Process each CSV file in the bank directory
for fname in os.listdir(BANK_DIR):
    # Skip non-CSV files
    if not fname.endswith('.csv'):
        continue
        
    # Get category name from mapping, fallback to filename without extension
    category = category_map.get(fname, os.path.splitext(fname)[0])
    
    # Read and process the CSV file
    file_path = os.path.join(BANK_DIR, fname)
    with open(file_path, encoding='utf-8') as f:
        reader = csv.reader(f)
        headers = next(reader)  # Skip header row
        
        # Find relevant column indices using flexible keyword matching
        problem_idx = find_column_index(headers, ['problem', 'question', 'title']) or 0
        status_idx = find_column_index(headers, ['status', 'state']) or 1
        brief_idx = find_column_index(headers, ['remark', 'brief', 'notes', 'description'])
        
        # Process each data row
        for row in reader:
            # Skip empty rows or rows without problem title
            if not row or not row[problem_idx].strip():
                continue
                
            # Extract and clean data
            title = row[problem_idx].strip()
            status = row[status_idx].strip() if len(row) > status_idx else 'unsolved'
            brief = row[brief_idx].strip() if brief_idx is not None and len(row) > brief_idx else ''
            
            # Normalize status to standard values
            status_norm = normalize_status(status)
            
            # Add to rows list
            rows.append({
                'category': category,
                'title': title,
                'status': status_norm,
                'brief': brief
            })

# Remove duplicate questions (same category + title combination)
# This prevents the same question from appearing multiple times
seen = set()
clean_rows = []
for row in rows:
    # Create unique key from category and title (case-insensitive)
    key = (row['category'].lower(), row['title'].lower())
    if key in seen:
        continue
    seen.add(key)
    clean_rows.append(row)

# Write consolidated data to output CSV file
with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=columns)
    writer.writeheader()
    for row in clean_rows:
        writer.writerow(row)

# Print summary statistics
print(f"✅ Successfully merged {len(clean_rows)} unique questions into {OUTPUT_CSV}")
print(f"📊 Categories processed: {len(set(row['category'] for row in clean_rows))}")
print(f"🗂️  Files processed: {len([f for f in os.listdir(BANK_DIR) if f.endswith('.csv')])}") 