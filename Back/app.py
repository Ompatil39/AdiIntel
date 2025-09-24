from flask import Flask, jsonify
import requests
import time
import threading


app = Flask(__name__)

POSTMAN_URL = "https://28efaf70-485d-4f8f-be7a-567b62d4b632.mock.pstmn.io/getData"

def fetch_and_print_data():
    try:
        response = requests.get(POSTMAN_URL)
        response.raise_for_status()
        data_list = response.json()  # List of JSON objects

        for idx, data in enumerate(data_list, start=1):
            print(f"\n--- Data {idx} ---")
            print(data)
            time.sleep(1)  # 1 second delay between each JSON

        print("\nAll 10 JSONs have been printed in the backend.")

    except Exception as e:
        print(f"Error fetching data: {e}")

@app.route("/startFetching", methods=["GET"])
def start_fetching():
    # Start the background thread
    thread = threading.Thread(target=fetch_and_print_data)
    thread.start()
    return jsonify({"status": "Data fetching started in the backend"}), 200

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
