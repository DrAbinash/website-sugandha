#!/bin/sh
set -e
echo "==> Applying database schema (prisma db push)..."
# The prisma CLI lives in its own isolated node_modules (see Dockerfile),
# separate from the standalone server's node_modules which only ships
# @prisma/client. This creates the SQLite tables on a fresh data volume.
node ./prisma-cli/node_modules/prisma/build/index.js db push \
  --schema ./prisma/schema.prisma --skip-generate --accept-data-loss || {
  echo "WARNING: prisma db push failed. Starting server anyway."
}
echo "==> Starting Next.js server on port ${PORT:-3000}..."
exec node server.js
