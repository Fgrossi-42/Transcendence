#!/bin/sh

# Wait for the database to be ready
echo "Waiting for the database to be ready..."
python3 manage.py wait_for_db

echo "Making migrations..."
python3 manage.py makemigrations

# Run the migrations
echo "Running migrations..."
python3 manage.py migrate

# Start the Django server
echo "Starting the server..."
exec "$@"