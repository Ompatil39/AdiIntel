import pandas as pd
from sqlalchemy import create_engine

# CSV file path
csv_file = r"C:\Users\jyoti\OneDrive\Desktop\ASF Hackathon\lasttry\mock_ads_deep_training_data.csv"


# SQLite engine
engine = create_engine("sqlite:///campaigns.db")  # This will create campaigns.db

# Define chunk size (10,000 rows per batch, you can increase if your RAM allows)
chunksize = 10000

# Load CSV in chunks
for i, chunk in enumerate(pd.read_csv(csv_file, chunksize=chunksize)):
    chunk.to_sql("campaign_data", engine, if_exists="append", index=False)
    print(f"Chunk {i+1} loaded")

print("All chunks loaded successfully into SQLite!")
