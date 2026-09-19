Contact managment system

A passcode protected contact manager built for yoobee 204B Cloud Application Devlopment. Add view, edit and delte contacts with a name, email, phone address and profile picture

Stack
Frontend - React (Vite), React Router hosted as a static site on S3
Backend - Python Flask REST API hosted on Elastic Beanstalk
Database - MySQL on RDS
Passcode is hashed with Werkzeug and verified server side

Running locally

Backend:
    cd backend
    pip install -r requirements.txt
    python app.py

Create `backend/.env` with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

Frontend:
    cd frontend
    npm install
    npm run dev
