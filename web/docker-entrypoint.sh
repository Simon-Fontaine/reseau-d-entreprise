#!/bin/sh
# =============================================================================
# Entrypoint script for the web application
# Handles migrations and startup
# =============================================================================

set -e

echo "🚀 Starting application..."

# Run migrations if enabled
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "🔄 Running database migrations..."
  node db/migrate.js
  echo "✅ Migrations complete"
fi

# Start the application
echo "🌐 Starting server..."
exec node server.js
