# main flask app this is the file that runs the backend server

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask import send_from_directory
import os
from db import get_connection
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

# creates a upload folder for profile pictures
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")

# loads the .env file so we can use the db password and other settings
load_dotenv()
app = Flask(__name__)
# lets the react frontend talk to this backend without getting blocked
CORS(app)

# gets the profile picture from the uploads folder to display on contact list/details 
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# checks if the passcode entered on the passcode page is correct
# looks up the most recent hashed passcode in the settings table and compares it
@app.route("/api/auth/verify", methods=["POST"])
def verify_passcode():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    # gets the newest passcode hash, only one should ever exist but this is a safety net
    cursor.execute("SELECT passcode_hash FROM settings ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    # check_password_hash compares the typed passcode against the stored hash, never the raw value
    if row and check_password_hash(row["passcode_hash"], data.get("passcode", "")):
        return jsonify({"success": True})
    return jsonify({"success": False, "message": "Incorrect passcode"}), 401

# updates the passcode, only works if the current passcode is entered correctly first
@app.route("/api/auth/change", methods=["POST"])
def change_passcode():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, passcode_hash FROM settings ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()

    # blocks the change if there's no row yet or the current passcode doesn't match
    if not row or not check_password_hash(row["passcode_hash"], data.get("currentPasscode", "")):
        cursor.close()
        conn.close()
        return jsonify({"message": "Current passcode is incorrect"}), 401

    # hashes the new passcode before saving it, never store it as plain text
    new_hash = generate_password_hash(data.get("newPasscode", ""))
    cursor.execute("UPDATE settings SET passcode_hash = %s WHERE id = %s", (new_hash, row["id"]))
    conn.commit()
    cursor.close()
    conn.close()
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
    name = request.form.get("name")
    email = request.form.get("email")
    phone = request.form.get("phone")
    address = request.form.get("address")
    # the profile picture cant just be called from the form data becuase its a file
    # so we have to check the request.files to check if there is a file
    # by default contact is set with no profile picture
    profile_picture = None
    # gets the image the user uploads from the request
    file = request.files.get("profilePicture")
    # checks to see if a profile picture was uploaded, if not it stays as default None
    if file and file.filename:
        #overwrite the filename to secure_filename
        filename = secure_filename(file.filename)
        # ceates the path to be saved to the uploads folder in the backend folder
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        # saves the file to the uploads folder
        file.save(file_path)
        # sets the profile_picture variable to the filename so it can be saved to the database
        profile_picture = filename

    if not name or not email:
        return jsonify({"message": "Name and email are required"}), 400

    # gets the connection to mysql
    conn = get_connection()
    # gets a cursor to execute the sql query
    cursor = conn.cursor()
    # adds a new contact to the database 
    cursor.execute(
        "INSERT INTO contacts (name, email, phone, address, profile_picture) VALUES (%s, %s, %s, %s, %s)",
        (name, email, phone, address, profile_picture)
    )
    # commits the changes to the database
    conn.commit()
    # gets the id of the new contact from mysql so it can be sent to the frontend
    new_id = cursor.lastrowid
    # closes cursor and its connection
    cursor.close()
    conn.close()
    # 
    return jsonify({"id": new_id}), 201

# updates an existing contact on the edit contact page
@app.route("/api/contacts/<int:contact_id>", methods=["PUT"])
def edit_contact(contact_id):
    data = request.json
    # checks if name and email are entered will give error if not
    if not data.get("name") or not data.get("email"):
        return jsonify({"message": "Name and email are required"}), 400
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