import mysql.connector
from mysql.connector import Error

# Database connection config
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",  
    "database": "adintelli"
}

def calculateROI():
    """
    Calculate ROI from campaigns table
    ROI = ((Total Sales - Total Cost) / Total Cost) * 100
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
        
        # Fetch cost and sale amount data
        cursor.execute("SELECT Cost, Sale_Amount FROM campaigns WHERE Cost IS NOT NULL AND Sale_Amount IS NOT NULL")
        rows = cursor.fetchall()
        
        if not rows:
            print("⚠️ No valid cost/sale data found")
            return 0
        
        # Calculate totals
        total_cost = 0
        total_sales = 0
        
        for cost, sale in rows:
            try:
                total_cost += float(cost) if cost is not None else 0
                total_sales += float(sale) if sale is not None else 0
            except (ValueError, TypeError) as e:
                print(f"⚠️ Skipping invalid data: cost={cost}, sale={sale}, error={e}")
                continue
        
        print(f"💰 Total Cost: ${total_cost:.2f}")
        print(f"💵 Total Sales: ${total_sales:.2f}")
        
        # Calculate ROI
        if total_cost == 0:
            print("⚠️ Total cost is zero, cannot calculate ROI")
            return 0
            
        roi = ((total_sales - total_cost) / total_cost) * 100
        print(f"📈 Calculated ROI: {roi:.2f}%")
        
        return roi

    except Error as e:
        print(f"❌ MySQL Error: {e}")
        return None
    except Exception as e:
        print(f"❌ General error in calculateROI: {e}")
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
    roi = calculateROI()
    if roi is not None:
        print(f"ROI: {roi:.2f}%")
    else:
        print("Failed to calculate ROI")