#!/bin/bash
set -e

# Function to check if PostgreSQL is healthy
is_postgres_ready() {
    docker logs database 2>&1 | grep -q "database system is ready to accept connections"
}

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until is_postgres_ready; do
    >&2 echo "PostgreSQL is unavailable - sleeping"
    sleep 1
done
echo "PostgreSQL is up"

npx prisma generate
# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy --preview-feature

# Start the NestJS application
echo "Starting NestJS application..."
npm run start:prod
