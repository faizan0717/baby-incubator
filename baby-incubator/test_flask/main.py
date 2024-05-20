from flask import Flask, Response, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

light_state = {"status": "off"}
fan_state = {"status": "off"}
temperature_range = {"min": 0, "max": 0}
automatic_control_state = {"enabled": False}

data = {
    "temperature": 25,
    "humidity": 50,
    "heartbeat": 80
}

@app.route('/data', methods=['GET'])
def get_data():
    return data

def create_json_response(message, status):
    response = {"message": message, "status": status}
    return Response(json.dumps(response), mimetype='application/json')

@app.route('/light/on', methods=['POST'])
def light_on():
    light_state["status"] = "on"
    return create_json_response("Light turned on", light_state["status"])

@app.route('/light/off', methods=['POST'])
def light_off():
    light_state["status"] = "off"
    return create_json_response("Light turned off", light_state["status"])

@app.route('/light/status', methods=['GET'])
def light_status():
    return create_json_response("Light status retrieved", light_state["status"])

@app.route('/fan/on', methods=['POST'])
def fan_on():
    fan_state["status"] = "on"
    return create_json_response("Fan turned on", fan_state["status"])

@app.route('/fan/off', methods=['POST'])
def fan_off():
    fan_state["status"] = "off"
    return create_json_response("Fan turned off", fan_state["status"])

@app.route('/fan/status', methods=['GET'])
def fan_status():
    return create_json_response("Fan status retrieved", fan_state["status"])

@app.route('/temperature/range', methods=['POST'])
def set_temperature_range():
    print("asdasd")
    data = request.json
    temperature_range["min"] = data.get("min")
    temperature_range["max"] = data.get("max")
    automatic_control_state["enabled"] = data.get("automaticControl")
    print(temperature_range,automatic_control_state)
    return create_json_response("Temperature range and automatic control state updated", temperature_range)

if __name__ == '__main__':
    app.run(debug=True)
