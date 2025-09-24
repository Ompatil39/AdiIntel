import mysql.connector

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="adintelli"
)

cursor = conn.cursor()

def calculateROI():
    """
    ROI = ((Total Sales - Total Cost) / Total Cost) * 100
    """
    cursor.execute("SELECT SUM(Sale_Amount), SUM(Cost) FROM campaigns")
    total_sales, total_cost = cursor.fetchone()
    roi = ((total_sales - total_cost) / total_cost) * 100
    return roi

# Example usage
print("ROI:", calculateROI(), "%")

cursor.close()
conn.close()