import mysql.connector
from mysql.connector import Error

# Database connection config
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",  
    "database": "adintelli"
}

def calculateCTR():
    """
    Calculate CTR (Click Through Rate) from campaigns table
    CTR = (Total Clicks / Total Impressions) * 100
    """
    conn = None
    cursor = None
    
    try:
        print("🔗 Connecting to database...")
        conn = mysql.connector.connect(**db_config)
        
        if not conn.is_connected():
            print("❌ Failed to connect to database")
            return None
            
        cursor = conn.cursor()
        
        # Check if table exists and has data
        cursor.execute("SELECT COUNT(*) FROM campaigns")
        count = cursor.fetchone()[0]
        print(f"📊 Found {count} records in campaigns table")
        
        if count == 0:
            print("⚠️ No data found in campaigns table")
            return 0
        
        # Fetch clicks and impressions data
        cursor.execute("SELECT Clicks, Impressions FROM campaigns WHERE Clicks IS NOT NULL AND Impressions IS NOT NULL")
        rows = cursor.fetchall()
        
        if not rows:
            print("⚠️ No valid clicks/impression data found")
            return 0
        
        # Calculate totals
        total_clicks = 0
        total_impressions = 0
        
        for clicks, impressions in rows:
            try:
                total_clicks += float(clicks) if clicks is not None else 0
                total_impressions += float(impressions) if impressions is not None else 0
            except (ValueError, TypeError) as e:
                print(f"⚠️ Skipping invalid data: clicks={clicks}, impressions={impressions}, error={e}")
                continue
        
        print(f"🖱️ Total Clicks: {total_clicks}")
        print(f"👁️ Total Impressions: {total_impressions}")
        
        # Calculate CTR
        if total_impressions == 0:
            print("⚠️ Total impressions is zero, cannot calculate CTR")
            return 0
            
        ctr = (total_clicks / total_impressions) * 100
        print(f"📈 Calculated CTR: {ctr:.2f}%")
        
        return ctr

    except Error as e:
        print(f"❌ MySQL Error: {e}")
        return None
    except Exception as e:
        print(f"❌ General error in calculateCTR: {e}")
        return None
    finally:
        # Clean up connections
        try:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()
                print("🔌 Database connection closed")
        except Exception as e:
            print(f"⚠️ Error closing database connection: {e}")

# Test function
if __name__ == "__main__":
    ctr = calculateCTR()
    if ctr is not None:
        print(f"CTR: {ctr:.2f}%")
    else:
        print("Failed to calculate CTR")
