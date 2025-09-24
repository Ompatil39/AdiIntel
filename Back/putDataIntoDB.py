import mysql.connector
import uuid

# Database connection config
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",  # your MySQL password
    "database": "adintelli"  # your database name
}

def insertIntoDB(data):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Ensure unique Ad_ID
        ad_id = data.get("Ad_ID") or str(uuid.uuid4())

        sql = """
        INSERT INTO campaigns
        (Ad_ID, Clicks, Impressions, Campaign_Name, Cost, Leads, Conversions, `Conversion Rate`,
         Sale_Amount, Ad_Date, Location, Device, Keyword, Platform)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        values = (
            ad_id,
            data.get("Clicks", 0),
            data.get("Impressions", 0),
            data.get("Campaign_Name", "Unknown"),
            data.get("Cost", 0.0),
            data.get("Leads", 0),
            data.get("Conversions", 0),
            data.get("Conversion Rate", 0.0),
            data.get("Sale_Amount", 0.0),
            data.get("Ad_Date", ""),
            data.get("Location", ""),
            data.get("Device", ""),
            data.get("Keyword", ""),
            data.get("Platform", "")
        )

        cursor.execute(sql, values)
        conn.commit()
        print(f"✅ Inserted campaign: {data.get('Campaign_Name', 'Unknown')} | Ad_ID: {ad_id}")
        return True

    except mysql.connector.Error as e:
        print(f"❌ MySQL Error in insertIntoDB: {e}")
        return False

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
