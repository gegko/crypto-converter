#!/bin/bash

until psql -h postgres -U your_database_user -d your_database_name -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "PostgreSQL is up - executing migrations"

npx prisma migrate dev

exec "$@"
