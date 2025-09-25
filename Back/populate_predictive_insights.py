import mysql.connector

def populate_predictive_insights():
    """Populate the predictive_insights table with sample data"""
    
    # Database connection
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="adintelli"
    )
    
    cursor = conn.cursor()
    
    # Sample data
    sample_data = [
        ("Summer Sale 2024", 15000.00, "Active", 2.45, "Target CPA", 234.00, 45000.00, "Yes", "Increase budget by 20%"),
        ("Black Friday Campaign", 25000.00, "Paused", 3.12, "Maximize Conversions", 189.00, 32000.00, "No", "Optimize ad copy and targeting"),
        ("Brand Awareness Q4", 12000.00, "Active", 1.89, "Target ROAS", 156.00, 28000.00, "Yes", "Expand to similar audiences"),
        ("Retargeting Campaign", 8500.00, "Active", 1.45, "Target CPA", 298.00, 38000.00, "Yes", "Scale up successful ad groups"),
        ("Holiday Shopping", 30000.00, "Active", 4.25, "Maximize Conversions", 145.00, 25000.00, "No", "Reduce CPC and improve quality score"),
        ("Mobile App Install", 18000.00, "Active", 2.15, "Target CPA", 267.00, 42000.00, "Yes", "Test new creative variations"),
        ("Product Launch 2024", 22000.00, "Active", 2.85, "Target ROAS", 198.00, 35000.00, "Yes", "Increase bid adjustments for high-performing keywords"),
        ("Seasonal Promotion", 16000.00, "Paused", 3.45, "Maximize Conversions", 123.00, 22000.00, "No", "Review and update negative keywords"),
        ("Lead Generation", 9500.00, "Active", 1.95, "Target CPA", 312.00, 28000.00, "Yes", "Expand to new geographic locations"),
        ("Brand Safety Campaign", 13000.00, "Active", 2.25, "Target ROAS", 178.00, 26000.00, "Yes", "Test different ad formats")
    ]
    
    try:
        # Clear existing data
        cursor.execute("DELETE FROM predictive_insights")
        
        # Insert sample data
        insert_query = """
        INSERT INTO predictive_insights 
        (Campaign_Name, Spend, Status, CPC, Bidding_Strategy, Conversions, Revenue, Profitable, Recommendation)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        cursor.executemany(insert_query, sample_data)
        conn.commit()
        
        print(f"Successfully inserted {len(sample_data)} records into predictive_insights table")
        
        # Verify the data
        cursor.execute("SELECT COUNT(*) FROM predictive_insights")
        count = cursor.fetchone()[0]
        print(f"Total records in table: {count}")
        
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    populate_predictive_insights()
