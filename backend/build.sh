backend> $build.sh
    set -o errexit

    pip install -r requirements.txt

    python -m backend.secp.manage collectstatic --no-input

    python manage.py migrate
