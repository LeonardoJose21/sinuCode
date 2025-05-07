backend/secp> $build.sh
    set -o errexit

    pip install -r requirements.txt

    python -m backend.manage collectstatic --no-input

    python manage.py migrate
