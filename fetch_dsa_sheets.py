import os
import csv
import gspread
from google.oauth2.service_account import Credentials

# --- CONFIGURATION ---
# The Google Sheet ID from the URL
SHEET_ID = '1uYDKndOZTgGZHkZcBm2gDkNcU-IxuYgR1axDQCe0408'
# Path to your Google service account credentials JSON file
CREDENTIALS_FILE = 'gcp_service_account.json'  # Place this in the project root
OUTPUT_DIR = 'frontend/src/data/dsa_sheets/'

# --- SETUP ---
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)
gc = gspread.authorize(creds)

# --- DOWNLOAD ALL SHEETS ---
sh = gc.open_by_key(SHEET_ID)

saved_files = []
for worksheet in sh.worksheets():
    title = worksheet.title.replace(' ', '_').replace('/', '_')
    csv_path = os.path.join(OUTPUT_DIR, f'{title}.csv')
    rows = worksheet.get_all_values()
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(rows)
    saved_files.append(csv_path)
    print(f"Saved: {csv_path}")

print("\nAll sheets downloaded:")
for f in saved_files:
    print(f) 