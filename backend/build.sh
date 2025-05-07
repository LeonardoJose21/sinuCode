#!/bin/bash
set -o errexit

# Go to the root of the project to install dependencies
pip install -r requirements.txt

# Run collectstatic and migrate from the current directory (which contains manage.py)
python manage.py collectstatic --no-input
python manage.py migrate
