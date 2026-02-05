#!/bin/bash
# =============================================================================
# Production Setup Script
# =============================================================================
# Run on your server:
#   curl -fsSL <raw-url>/setup.sh | bash
# =============================================================================

set -e

INSTALL_DIR="${HOME}/web"
REPO_BASE="https://gitea.intranet.advancedyapping.be/simon-fontaine/reseau-d-entreprise/raw/branch/web"

echo "🚀 Setting up production environment..."

mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Download files
echo "📥 Downloading docker-compose.yml..."
curl -fsSL "${REPO_BASE}/docker-compose.yml" -o docker-compose.yml

if [ ! -f .env ]; then
  curl -fsSL "${REPO_BASE}/.env.example" -o .env
  echo ""
  echo "⚠️  Edit .env with your values:"
  echo "   nano ${INSTALL_DIR}/.env"
  echo ""
  echo "Required:"
  echo "  - GITEA_RUNNER_TOKEN (from Gitea → Settings → Actions → Runners)"
  echo "  - DB_PASSWORD (strong password)"
  echo "  - AUTH_SECRET (run: openssl rand -base64 32)"
  echo ""
  read -p "Press Enter after editing .env..."
fi

# Login to registry
echo "🔐 Login to container registry..."
docker login gitea.intranet.advancedyapping.be

# Start
echo "🐳 Starting services..."
docker compose up -d

echo ""
echo "✅ Done! Services:"
echo "   - Runner: Building your code"
echo "   - App: http://localhost:3000"
echo "   - Watchtower: Auto-deploys on push"
