./backend > $build.sh
  set -o errexit
  
  # Go to the root of the project to install dependencies
  pip install -r requirements.txt
  
  # Run collectstatic and migrate from the current directory (which contains manage.py)
  python backend/manage.py collectstatic --no-input
  python backend/manage.py migrate
