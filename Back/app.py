from flask import Flask, jsonify
from flask_cors import CORS
import requests
import time
import threading
from putDataIntoDB import insertIntoDB
from calcROI import calculateROI

app = Flask(__name__)
CORS(app)

POSTMAN_URL = "https://28efaf70-485d-4f8f-be7a-567b62d4b632.mock.pstmn.io/getData"

# Global variable to track data insertion status
data_insertion_complete = False

def fetch_and_insert_data():
    global data_insertion_complete
    data_insertion_complete = False
    try:
        print("🚀 Starting data fetch from Postman API...")
        response = requests.get(POSTMAN_URL, timeout=10)
        response.raise_for_status()
        data_list = response.json()
        print(f"📦 Received {len(data_list)} records from API")

        for idx, data in enumerate(data_list, start=1):
            print(f"📝 Processing record {idx}/{len(data_list)}")
            success = insertIntoDB(data)
            if not success:
                print(f"⚠ Record {idx} failed to insert")
            # time.sleep(0.5)

        data_insertion_complete = True
        print("🎉 All data insertion completed successfully!")

    except requests.RequestException as e:
        print(f"🌐 Network error fetching data: {e}")
    except Exception as e:
        print(f"❌ General error in fetch_and_insert_data: {e}")

@app.route("/", methods=["GET"])
def start_fetching():
    try:
        thread = threading.Thread(target=fetch_and_insert_data, daemon=True)
        thread.start()
        return jsonify({
            "status": "success", 
            "message": "Data fetching started in background"
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error", 
            "message": f"Failed to start data fetching: {str(e)}"
        }), 500

@app.route("/calcROI", methods=["GET"])
def roi():
    try:
        print("💰 Calculating ROI...")
        roi_value = calculateROI()
        if roi_value is None:
            return jsonify({
                "status": "error", 
                "message": "Unable to calculate ROI - no data available"
            }), 500
        print(f"📊 ROI calculated: {roi_value:.2f}%")
        return jsonify({
            "status": "success",
            "roi": round(roi_value, 2),
            "data_insertion_complete": data_insertion_complete
        }), 200
    except Exception as e:
        print(f"❌ Error in ROI calculation endpoint: {e}")
        return jsonify({
            "status": "error", 
            "message": f"ROI calculation failed: {str(e)}"
        }), 500

@app.route("/status", methods=["GET"])
def get_status():
    return jsonify({
        "data_insertion_complete": data_insertion_complete
    }), 200

if __name__ == "__main__":
    print("🔥 Starting Flask server...")
    app.run(debug=True, use_reloader=False, host='localhost', port=5000)