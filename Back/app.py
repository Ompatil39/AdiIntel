from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import numpy as np
import time
import requests
import logging
import joblib
from tensorflow.keras.models import load_model
import os
from huggingface_hub import InferenceClient


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)


def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="adintelli"
    )


def calculateROI():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="adintelli"
    )
    cursor = conn.cursor()
    cursor.execute("SELECT SUM(Sale_Amount), SUM(Cost) FROM campaigns")
    total_sales, total_cost = cursor.fetchone()
    roi = ((total_sales - total_cost) / total_cost) * 100
    cursor.close()
    conn.close()
    return roi

def calculateCTR():
    """
    CTR = (Total Clicks / Total Impressions) * 100
    """
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="adintelli"
    )
    cursor = conn.cursor()
    cursor.execute("SELECT SUM(Clicks), SUM(Impressions) FROM campaigns")
    total_clicks, total_impressions = cursor.fetchone()
    ctr = (total_clicks / total_impressions) * 100
    cursor.close()
    conn.close()
    return ctr

def get_total_conversions():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="adintelli"
    )
    cursor = conn.cursor()
    cursor.execute("SELECT SUM(Conversions) FROM campaigns")
    total_conversions = cursor.fetchone()[0]  # single value
    cursor.close()
    conn.close()
    return total_conversions

def calculate_campaign_score():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="adintelli"
    )
    cursor = conn.cursor()
    
    # Get total values
    cursor.execute("SELECT SUM(Sale_Amount), SUM(Cost), SUM(Clicks), SUM(Impressions), SUM(Conversions) FROM campaigns")
    total_sales, total_cost, total_clicks, total_impressions, total_conversions = cursor.fetchone()
    
    # ROI %
    roi = ((total_sales - total_cost) / total_cost) * 100 if total_cost else 0
    
    # CTR %
    ctr = (total_clicks / total_impressions) * 100 if total_impressions else 0
    
    # Conversion Rate %
    conv_rate = (total_conversions / total_clicks) * 100 if total_clicks else 0
    
    # Simple average for Campaign Score
    campaign_score = (roi + ctr + conv_rate) / 3
    
    cursor.close()
    conn.close()
    
    return campaign_score

def get_platform_data():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="adintelli"
    )
    cursor = conn.cursor()

    platforms = ["Google", "Facebook", "Linkedin", "Twitter"]
    result = []

    for platform in platforms:
        cursor.execute(
            "SELECT SUM(Conversions), SUM(Cost), SUM(Clicks) FROM campaigns WHERE Platform=%s",
            (platform,)
        )
        total_conversions, total_cost, total_clicks = cursor.fetchone()
        cpc = (total_cost / total_clicks) if total_clicks else 0

        result.append({
            "platform": platform,
            "conversion": total_conversions or 0,
            "cost": float(total_cost or 0),
            "cpc": float(cpc)
        })

    cursor.close()
    conn.close()
    return result

@app.route("/getPlatformData", methods=["GET"])
def platform_data():
    time.sleep(1)
    return jsonify(get_platform_data())

@app.route("/getCampaignScore", methods=["GET"])
def get_campaign_score():
    time.sleep(1)
    camp_score = calculate_campaign_score()
    return jsonify({"campaign_score": float(camp_score)})

@app.route("/getConversions", methods=["GET"])
def total_conversions():
    time.sleep(1)
    total_cov = get_total_conversions()
    return jsonify({"total_conversions": float(total_cov)})

@app.route('/getROI', methods=['GET'])
def roi():
    time.sleep(1)
    roi_value = calculateROI()
    return jsonify({"roi": float(roi_value)})

@app.route('/getCTR', methods=['GET'])
def get_ctr():
    time.sleep(1)
    ctr_value = calculateCTR()
    return jsonify({"ctr": float(ctr_value)})


@app.route('/getAllCampaigns', methods=['GET'])
def get_all_campaigns():
    time.sleep(1)
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="adintelli"
    )
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT Campaign_Name, Cost, Sale_Amount, Impressions, Clicks, Conversions FROM campaigns")
    campaigns = cursor.fetchall()

    result = []
    for c in campaigns:
        impressions = c['Impressions'] or 0
        clicks = c['Clicks'] or 0
        cost = c['Cost'] or 0
        sale_amount = c['Sale_Amount'] or 0
        conversions = c['Conversions'] or 0

        # Calculations
        ctr = (clicks / impressions * 100) if impressions > 0 else 0
        cpc = (cost / clicks) if clicks > 0 else 0
        roas = (sale_amount / cost) if cost > 0 else 0

        result.append({
            "campaign_name": c['Campaign_Name'],
            "cost": cost,
            "sale_amount": sale_amount,
            "impressions": impressions,
            "clicks": clicks,
            "conversions": conversions,
            "ctr": round(ctr, 2),
            "cpc": round(cpc, 2),
            "roas": round(roas, 2)
        })

    cursor.close()
    conn.close()
    return jsonify(result)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="adintelli"
    )

@app.route('/realTime', methods=['GET'])
def real_time_update():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch all campaigns
    cursor.execute("SELECT Campaign_Name, Cost, Clicks, Impressions, Conversions FROM campaigns")
    campaigns = cursor.fetchall()

    total_clicks = 0
    total_impressions = 0
    total_conversions = 0
    total_cpc = 0
    count = len(campaigns)

    for c in campaigns:
        campaign_name = c['Campaign_Name']

        # Randomize metrics
        clicks = np.random.randint(0, 51)
        impressions = np.random.randint(0, 101)
        conversions = np.random.randint(0, 16)

        # Update DB
        cursor.execute(
            "UPDATE campaigns SET Clicks=%s, Impressions=%s, Conversions=%s WHERE Campaign_Name=%s",
            (clicks, impressions, conversions, campaign_name)
        )

        # Aggregate
        total_clicks += clicks
        total_impressions += impressions
        total_conversions += conversions
        cost = c['Cost'] or 0
        total_cpc += (cost / clicks) if clicks > 0 else 0

    conn.commit()
    cursor.close()
    conn.close()

    avg_ctr = (total_clicks / total_impressions * 100) if total_impressions else 0
    avg_conversions = (total_conversions / count) if count else 0

    result = {
        "total_campaigns": count,
        "total_impressions": total_impressions,
        "avg_ctr": round(avg_ctr, 2),
        "total_clicks": total_clicks,
        "avg_conversions": round(avg_conversions, 2),
        "total_cpc": round(total_cpc, 2)
    }

    return jsonify(result)


def get_kpi_data():
    try:
        conn = get_db_connection()
        if not conn:
            return {"error": "Database connection failed"}
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                DATE_FORMAT(Ad_Date, '%b') AS month,
                SUM(Sale_Amount) AS total_sales,
                SUM(Cost) AS total_cost,
                SUM(Clicks) AS total_clicks,
                SUM(Impressions) AS total_impressions
            FROM campaigns
            GROUP BY DATE_FORMAT(Ad_Date, '%b')
            ORDER BY MIN(Ad_Date)
        """)
        kpi_data = []
        for row in cursor.fetchall():
            month, total_sales, total_cost, total_clicks, total_impressions = row
            roi = ((total_sales - total_cost) / total_cost) * 100 if total_cost else 0
            ctr = (total_clicks / total_impressions) * 100 if total_impressions else 0
            kpi_data.append({
                "name": month,
                "roi": round(float(roi), 2),
                "ctr": round(float(ctr), 2)
            })
        cursor.close()
        conn.close()
        return kpi_data
    except Exception as e:
        logger.error(f"Error in get_kpi_data: {str(e)}")
        return {"error": f"Failed to fetch KPI data: {str(e)}"}

def get_campaign_performance():
    try:
        conn = get_db_connection()
        if not conn:
            return {"error": "Database connection failed"}
        cursor = conn.cursor()
        # Fetch top 5 keywords by conversions to avoid overwhelming the chart
        cursor.execute("""
            SELECT Keyword, SUM(Conversions) as total_conversions
            FROM campaigns
            GROUP BY Keyword
            ORDER BY total_conversions DESC
            LIMIT 5
        """)
        keywords = cursor.fetchall()
        cursor.execute("SELECT SUM(Conversions) FROM campaigns")
        total_conversions = cursor.fetchone()[0] or 1
        colors = ["#4CAF50", "#2196F3", "#FFC107", "#F44336", "#9C27B0"]
        result = []
        for i, (keyword, conversions) in enumerate(keywords):
            value = (conversions / total_conversions * 100) if total_conversions else 0
            result.append({
                "name": keyword or "Unknown",
                "value": round(float(value), 2),
                "color": colors[i % len(colors)]
            })
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        logger.error(f"Error in get_campaign_performance: {str(e)}")
        return {"error": f"Failed to fetch campaign performance: {str(e)}"}

# NEW ROUTES FOR CHARTS DATA
def get_weekly_trends():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get data for the last 7 days grouped by date
        cursor.execute("""
            SELECT 
                DATE(Ad_Date) as date,
                SUM(Impressions) as impressions,
                SUM(Clicks) as clicks,
                SUM(Conversions) as conversions
            FROM campaigns 
            WHERE Ad_Date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            AND Ad_Date IS NOT NULL
            AND Ad_Date != ''
            GROUP BY DATE(Ad_Date)
            ORDER BY date
        """)
        
        # Create a dictionary to store data by date
        db_data = {}
        for row in cursor.fetchall():
            date, impressions, clicks, conversions = row
            if date:  # Only process if date is not None
                db_data[date] = {
                    "impressions": impressions or 0,
                    "clicks": clicks or 0,
                    "conversions": conversions or 0
                }
        
        cursor.close()
        conn.close()
        
        # Generate complete week data (last 7 days)
        from datetime import datetime, timedelta
        trends = []
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        
        # Start from 6 days ago to get a full week
        for i in range(7):
            current_date = datetime.now() - timedelta(days=6-i)
            date_key = current_date.date()
            day_name = days[current_date.weekday()]
            
            # Use database data if available, otherwise use sample data
            if date_key in db_data:
                data = db_data[date_key]
            else:
                # Generate sample data with some variation
                base_impressions = 20000 + (i * 2000)
                base_clicks = int(base_impressions * 0.03)  # 3% CTR
                base_conversions = int(base_clicks * 0.02)  # 2% conversion rate
                
                data = {
                    "impressions": base_impressions,
                    "clicks": base_clicks,
                    "conversions": base_conversions
                }
            
            trends.append({
                "date": day_name,
                "impressions": data["impressions"],
                "clicks": data["clicks"],
                "conversions": data["conversions"]
            })
        
        return trends
        
    except Exception as e:
        logger.error(f"Error in get_weekly_trends: {str(e)}")
        # Return sample data if there's an error
        return [
            {"date": "Mon", "impressions": 18000, "clicks": 540, "conversions": 12},
            {"date": "Tue", "impressions": 22000, "clicks": 660, "conversions": 15},
            {"date": "Wed", "impressions": 19000, "clicks": 570, "conversions": 11},
            {"date": "Thu", "impressions": 25000, "clicks": 750, "conversions": 18},
            {"date": "Fri", "impressions": 28000, "clicks": 840, "conversions": 21},
            {"date": "Sat", "impressions": 15000, "clicks": 450, "conversions": 9},
            {"date": "Sun", "impressions": 12000, "clicks": 360, "conversions": 7}
        ]

def get_device_demographics():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get data grouped by device
        cursor.execute("""
            SELECT 
                Device,
                SUM(Impressions) as impressions,
                SUM(Conversions) as conversions
            FROM campaigns 
            GROUP BY Device
        """)
        
        demographics = []
        for row in cursor.fetchall():
            device, impressions, conversions = row
            demographics.append({
                "device": device or "Unknown",
                "impressions": impressions or 0,
                "conversions": conversions or 0
            })
        
        cursor.close()
        conn.close()
        
        # If no data, return sample data
        if not demographics:
            return [
                {"device": "Mobile", "impressions": 45000, "conversions": 23},
                {"device": "Desktop", "impressions": 89000, "conversions": 67},
                {"device": "Tablet", "impressions": 23000, "conversions": 12}
            ]
        
        return demographics
    except Exception as e:
        logger.error(f"Error in get_device_demographics: {str(e)}")
        return [
            {"device": "Mobile", "impressions": 45000, "conversions": 23},
            {"device": "Desktop", "impressions": 89000, "conversions": 67},
            {"device": "Tablet", "impressions": 23000, "conversions": 12}
        ]

@app.route('/getWeeklyTrends', methods=['GET'])
def weekly_trends():
    return jsonify(get_weekly_trends())

@app.route('/getDeviceDemographics', methods=['GET'])
def device_demographics():
    return jsonify(get_device_demographics())

@app.route('/getKpiData', methods=['GET'])
def kpi_data():
    return jsonify(get_kpi_data())

@app.route('/getCampaignPerformance', methods=['GET'])
def campaign_performance():
    return jsonify(get_campaign_performance())

@app.route('/getPredictiveInsights', methods=['GET'])
def predictive_insights():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Query the predictive_insights table
        cursor.execute("""
            SELECT Campaign_Name, Spend, Status, CPC, Bidding_Strategy, 
                   Conversions, Revenue, Profitable, Recommendation 
            FROM predictive_insights
            ORDER BY Campaign_Name
        """)
        
        results = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        
        # Convert to list of dictionaries
        data = []
        for row in results:
            data.append(dict(zip(columns, row)))
        
        cursor.close()
        conn.close()
        
        return jsonify(data)
        
    except Exception as e:
        logger.error(f"Error fetching predictive insights: {str(e)}")
        return jsonify({"error": ""}), 500


# Initialize client once
client = InferenceClient(api_key=HF_API_KEY)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    if not user_message:
        return jsonify({"reply": "No message received."})

    try:
        completion = client.chat.completions.create(
            model=HF_MODEL,
            messages=[
                {"role": "system", "content": """You are a helpful assistant of the site ADIntelli and will now help user solve their problems.
                you should not go more than 3 max lines, its your limit.
                    AdIntelli Frontend User Interface Guide
Navigation Structure
Main Dashboard Sections (Sidebar Navigation)
1. Executive Overview
Location: Main dashboard landing page
Contains:
Total ROI percentage card
Click-Through Rate (CTR) card
Total Conversions counter
Campaign Score with progress bar
Performance trends line chart (ROI vs CTR over months)
Campaign distribution pie chart
Platform performance cards (Google, Facebook, LinkedIn, Twitter)
2. Campaign Management
Location: Second tab in sidebar
Contains:
Active campaigns list with metrics (impressions, clicks, conversions, CTR, CPC, ROAS)
Weekly performance trends chart
Audience demographics bar chart
Performance alerts section with anomaly detection
3. Budget Optimization
Location: Third tab in sidebar
Contains:
Budget overview cards (Total Budget, Spent, Remaining, Avg ROAS)
Campaign budget status with progress bars
AI budget recommendations
ROI forecast area chart
Platform budget allocation bar chart
Budget simulator with slider
4. Real-Time Monitoring
Location: Fourth tab in sidebar
Contains:
Live metrics cards (Active Campaigns, Impressions, CTR, Clicks, Conversions, CPC)
Live performance line chart
Live spend tracking area chart
Live alerts and notifications
Quick action buttons
AI Assistant Panel
Location: Right sidebar (desktop only)
Contains: Chat interface with AI assistant for campaign insights and recommendations
Header Features
Search Bar: Global search functionality
Notifications Bell: Shows alerts and updates
Settings: User preferences
User Avatar: Profile access
User Workflow Guide
To view overall performance: Go to Executive Overview tab
To manage campaigns: Go to Campaign Management tab
To optimize budget: Go to Budget Optimization tab
To monitor live data: Go to Real-Time Monitoring tab
To get AI help: Use the AI Assistant panel on the right
Response Guidelines for AI Assistant
The AI assistant should provide concise, 3-line maximum responses that:
Direct users to the correct dashboard section
Explain what they'll find there
Suggest specific actions they can take
Example responses:
"Go to Executive Overview tab to see your ROI and CTR metrics. You'll find performance trends and platform data there. Click on any metric card for detailed breakdown."
"Visit Campaign Management tab to view all active campaigns. You can see performance metrics and weekly trends. Use the alerts section to identify optimization opportunities."
"Check Budget Optimization tab for AI recommendations. You'll see budget status, forecasts, and can use the simulator. Apply suggested changes to improve performance."
                  """},
                {"role": "user", "content": user_message}
            ],
        )


        # Extract reply text safely
        reply = completion.choices[0].message.get("content", "")
        if not reply:
            reply = "Model returned empty response."

    except Exception as e:
        reply = f"Error calling model: {str(e)}"

    return jsonify({"reply": reply})






DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",      # update if needed
    "database": "adintelli"
}

MODEL_PATH = "multi_task_model2.keras"
PLATFORM_ENCODER_PATH = "platform_encoder.save"
BID_ENCODER_PATH = "bid_strategy_encoder.save"
BUDGET_REC_ENCODER_PATH = "budget_rec_encoder.save"
AUDIENCE_ENCODER_PATH = "audience_exp_encoder.save"
SCALER_PATH = "feature_scaler.save"

# ---------------- Load ML Components ----------------
model = load_model(MODEL_PATH)
platform_encoder = joblib.load(PLATFORM_ENCODER_PATH)
bid_strategy_encoder = joblib.load(BID_ENCODER_PATH)
budget_rec_encoder = joblib.load(BUDGET_REC_ENCODER_PATH)
audience_exp_encoder = joblib.load(AUDIENCE_ENCODER_PATH)
scaler = joblib.load(SCALER_PATH)


# ---------------- Fetch only 1 row ----------------
def fetch_one_campaign():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM campaigns 
        ORDER BY `Ad_ID` DESC LIMIT 1
    """)
    row = cursor.fetchone()
    conn.close()
    return row


# ---------------- Prediction ----------------
def predict_campaign(row):
    row = row.copy()

    # Fix platform naming (add " Ads")
    row['Platform'] = str(row.get('Platform', 'Unknown')) + " Ads"
    row['platform_encoded'] = platform_encoder.transform([row['Platform']])[0]

    # Budget distribution parsing
    if isinstance(row.get('recommended_budget_distribution'), str):
        parts = row['recommended_budget_distribution'].split(',')
        percentages = []
        for part in parts:
            try:
                percent = float(part.strip().split('%')[0])
            except:
                percent = 0.0
            percentages.append(percent)
        while len(percentages) < 3:
            percentages.append(0.0)
        budget_alpha, budget_beta, budget_gamma = percentages
    else:
        budget_alpha = budget_beta = budget_gamma = 0.0

    # CTR = (Clicks / Impressions) * 100
    impressions = float(row.get("Impressions", 0))
    clicks = float(row.get("Clicks", 0))
    ctr = (clicks / impressions * 100) if impressions > 0 else 0.0

    # ROAS = Sale_Amount / Cost
    spend = float(row.get("Cost", 0))
    sale_amount = float(row.get("Sale_Amount", 0))
    roas = (sale_amount / spend) if spend > 0 else 0.0

    # Prepare model input
    X_input = np.array([[row['platform_encoded'], impressions, clicks, spend,
                         row.get("Conversions", 0), ctr, roas,
                         budget_alpha, budget_beta, budget_gamma]])
    X_scaled = scaler.transform(X_input)
    preds_list = model.predict(X_scaled)

    output_names = ['campaign_score', 'roi_forecast', 'avg_perf_score', 'budget_dist',
                    'budget_realloc', 'performance_alerts', 'budget_rec',
                    'audience_exp', 'bid_strategy']
    preds = {name: pred for name, pred in zip(output_names, preds_list)}

    # Build result
    result = {}
    result["Campaign Name"] = row.get("Campaign_Name", "Unknown")
    result["Campaign Score"] = round(float(preds['campaign_score'].ravel()[0]), 2)
    result["Performance Alerts"] = "Triggered" if float(preds['performance_alerts'].ravel()[0]) > 0.5 else "Normal"
    result["Budget Reallocation (%)"] = round(float(preds['budget_realloc'].ravel()[0]), 2)

    bid_idx = np.argmax(preds['bid_strategy'])
    result["Bid Strategy Optimization"] = bid_strategy_encoder.inverse_transform([bid_idx])[0]

    result["ROI Forecast (ROAS)"] = round(float(preds['roi_forecast'].ravel()[0]), 2)
    result["Avg Performance Score"] = round(float(preds['avg_perf_score'].ravel()[0]), 2)
    result["Audience Expansion"] = "Yes" if float(preds['audience_exp'].ravel()[0]) > 0.5 else "No"

    budget_idx = np.argmax(preds['budget_rec'])
    result["Budget Recommendation"] = budget_rec_encoder.inverse_transform([budget_idx])[0]

    return result


# ---------------- Flask Route ----------------
@app.route("/predict", methods=["POST"])
def predict_route():
    data = request.get_json()
    campaign_name = data.get("campaign_name")  # <-- read from JSON body
    if not campaign_name:
        return jsonify({"error": "campaign_name parameter is required"}), 400

    # Fetch campaign by name
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM campaigns WHERE Campaign_Name = %s LIMIT 1", (campaign_name,))
    campaign = cursor.fetchone()
    conn.close()

    if not campaign:
        return jsonify({"error": f"No campaign found with name '{campaign_name}'"}), 404

    prediction = predict_campaign(campaign)
    return jsonify(prediction)




if __name__ == "__main__":
    app.run(debug=True)