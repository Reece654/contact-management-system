# main flask app this is the file that runs the backend server

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from db import get_connection

# loads the .env file so we can use the db password and other settings
load_dotenv()
app = Flask(__name__)
# lets the react frontend talk to this backend without getting blocked
CORS(app)

# the passcode starts as whatever is in .env. changes if the user updates it
current_passcode = os.getenv("INITIAL_PASSCODE", "0000")

# checks if the passcode entered on the passcode page is correct
@app.route("/api/auth/verify", methods=["POST"])
def verify_passcode():
    data = request.json
    if data.get("passcode") == current_passcode:
        return jsonify({"success": True})
    return jsonify({"success": False, "message": "Incorrect passcode"}), 401

# updates the passcode
@app.route("/api/auth/change", methods=["POST"])
def change_passcode():
    global current_passcode
    data = request.json
    if data.get("currentPasscode") != current_passcode:
        return jsonify({"message": "Current passcode is incorrect"}), 401
    current_passcode = data.get("newPasscode")
    return jsonify({"message": "Passcode updated"})

# gets every contact on the contact list page
@app.route("/api/contacts", methods=["GET"])
def get_contacts():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM contacts")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(rows)

# gets one contact by using id on the contact detail and edit contact pages
@app.route("/api/contacts/<int:contact_id>", methods=["GET"])
def get_contact(contact_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM contacts WHERE id = %s", (contact_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    if not row:
        return jsonify({"message": "Contact not found"}), 404
    return jsonify(row)

# saves a new contact on the add contact page
@app.route("/api/contacts", methods=["POST"])
def add_contact():
    data = request.json
    if not data.get("name") or not data.get("email"):
        return jsonify({"message": "Name and email are required"}), 400
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO contacts (name, email, phone, address, profile_picture) VALUES (%s, %s, %s, %s, %s)",
        (data.get("name"), data.get("email"), data.get("phone"), data.get("address"), data.get("profilePicture"))
    )
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return jsonify({"id": new_id}), 201

# updates an existing contact on the edit contact page
@app.route("/api/contacts/<int:contact_id>", methods=["PUT"])
def edit_contact(contact_id):
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE contacts SET name=%s, email=%s, phone=%s, address=%s, profile_picture=%s WHERE id=%s",
        (data.get("name"), data.get("email"), data.get("phone"), data.get("address"), data.get("profilePicture"), contact_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Contact updated"})

# deletes a contact on the contact detail page
@app.route("/api/contacts/<int:contact_id>", methods=["DELETE"])
def delete_contact(contact_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM contacts WHERE id = %s", (contact_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Contact deleted"})

# starts the server when you run python app.py directly
if __name__ == "__main__":
    app.run(debug=True, port=5000)