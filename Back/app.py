# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow frontend requests

@app.route('/api/conversation', methods=['POST'])
def conversation():
    data = request.json
    user_message = data.get("message", "")
    # for now just respond with a dummy reply
    return jsonify({"reply": f"Flask says: yeeee, you clicked the button! (you sent: {user_message})"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)