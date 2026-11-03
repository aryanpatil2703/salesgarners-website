#!/bin/bash
# ==============================================================================
# SalesGarners Production EC2 Deployment Script
# Supports: Ubuntu 22.04 LTS / 24.04 LTS on AWS EC2
# ==============================================================================

set -e

echo "🚀 Starting SalesGarners EC2 Production Setup..."

# 1. Update OS and install prerequisites
echo "📦 Updating packages..."
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y curl git ufw nginx certbot python3-certbot-nginx ca-certificates

# 2. Install Docker & Docker Compose if not installed
if ! command -v docker &> /dev/null; then
  echo "🐳 Installing Docker Engine..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
  rm get-docker.sh
  echo "✅ Docker installed successfully."
fi

# 3. Configure Security & Firewall
echo "🛡️ Configuring UFW firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable

# 4. Check for production .env file
if [ ! -f .env ]; then
  echo "⚠️ No .env file found in $(pwd)!"
  echo "Creating .env template. Please edit it with your production secrets:"
  cp .env.example .env
  echo "❗ Please run 'nano .env' to set POSTGRES_PASSWORD and OPENAI_API_KEY before continuing."
  exit 1
fi

# 5. Build and run production containers
echo "🏗️ Building and launching Docker containers..."
sudo docker compose -f docker-compose.prod.yml up -d --build

# 6. Wait for pgvector container health check
echo "⏳ Waiting for pgvector database to become healthy..."
sleep 12

# 7. Run one-time vector database seeding
echo "🧠 Seeding SalesGarners knowledge base into pgvector..."
sudo docker compose -f docker-compose.prod.yml exec web npm run ingest

echo "=============================================================================="
echo "🎉 SalesGarners production deployment completed successfully!"
echo "Next.js app running at: http://127.0.0.1:3000"
echo ""
echo "To set up domain and SSL with Nginx & Certbot:"
echo "1. sudo cp deploy/nginx-salesgarners.conf /etc/nginx/sites-available/salesgarners.conf"
echo "2. sudo ln -s /etc/nginx/sites-available/salesgarners.conf /etc/nginx/sites-enabled/"
echo "3. sudo certbot --nginx -d salesgarners.com -d www.salesgarners.com"
echo "4. sudo systemctl restart nginx"
echo "=============================================================================="

