# handles the connection to the mysql database

import mysql.connector
import os
from dotenv import load_dotenv

# loads the .env file so we can use the db login details
load_dotenv()

# opens a connection to the database using the details in .env
def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )