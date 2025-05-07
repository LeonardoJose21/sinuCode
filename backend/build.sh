backed> $build.sh
    set -o errexit

    pip install -r requirements.txt

    python -m backend.secp.manage.py collectstatic --no-input

    python manage.py migrate
