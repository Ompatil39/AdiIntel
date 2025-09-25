import sqlite3

conn = sqlite3.connect("campaigns.db")
cursor = conn.cursor()

# List tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
print(cursor.fetchall())

# Check first 5 rows from correct table
cursor.execute("SELECT * FROM campaign_data LIMIT 5;")
for row in cursor.fetchall():
    print(row)

conn.close()
