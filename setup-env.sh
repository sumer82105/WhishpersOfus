#!/bin/bash

echo "🚀 Setting up Whispers of Us Environment Configuration"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 missing"
        return 1
    fi
}

# Function to copy example file if .env doesn't exist
setup_env_file() {
    local dir=$1
    local example_file="$dir/.env.example"
    local env_file="$dir/.env"
    
    if [ ! -f "$env_file" ]; then
        if [ -f "$example_file" ]; then
            cp "$example_file" "$env_file"
            echo -e "${GREEN}✓${NC} Created $env_file from example"
            echo -e "${YELLOW}⚠${NC}  Please edit $env_file with your actual values"
        else
            echo -e "${RED}✗${NC} $example_file not found"
        fi
    else
        echo -e "${GREEN}✓${NC} $env_file already exists"
    fi
}

echo ""
echo "📁 Checking project structure..."
echo "================================"

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    echo "Expected structure:"
    echo "  ├── frontend/"
    echo "  ├── backend/"
    echo "  └── setup-env.sh"
    exit 1
fi

echo -e "${GREEN}✓${NC} Project structure looks good"

echo ""
echo "🔧 Setting up environment files..."
echo "================================="

# Setup frontend environment
echo "Frontend:"
setup_env_file "frontend"

# Setup backend environment  
echo "Backend:"
setup_env_file "backend"

echo ""
echo "📋 Configuration Checklist"
echo "========================="
echo ""
echo "Frontend (.env):"
echo "  [ ] REACT_APP_API_BASE_URL - Your backend URL"
echo "  [ ] REACT_APP_FIREBASE_* - Firebase configuration"
echo "  [ ] REACT_APP_CLOUDINARY_* - Cloudinary configuration"
echo ""
echo "Backend (.env):"
echo "  [ ] MONGODB_URI - MongoDB connection string"
echo "  [ ] FIREBASE_PROJECT_ID - Firebase project ID"
echo "  [ ] JWT_SECRET - Secure random string"
echo "  [ ] CORS_ALLOWED_ORIGINS - Frontend URL"
echo ""
echo "📚 Additional Setup Required:"
echo "============================"
echo ""
echo "1. 🔥 Firebase Setup:"
echo "   - Create project at https://console.firebase.google.com"
echo "   - Enable Authentication (Email/Password)"
echo "   - Download service account key to backend/src/main/resources/"
echo ""
echo "2. 🍃 MongoDB Setup:"
echo "   - Create cluster at https://cloud.mongodb.com"
echo "   - Add database user and get connection string"
echo "   - Whitelist IP addresses for access"
echo ""
echo "3. ☁️  Cloudinary Setup:"
echo "   - Create account at https://cloudinary.com"
echo "   - Get cloud name and create upload preset"
echo ""
echo "4. 🚀 For Deployment:"
echo "   - Frontend: Deploy to Vercel (connect GitHub repo)"
echo "   - Backend: Deploy to Render (connect GitHub repo)"
echo "   - Set environment variables in respective dashboards"
echo ""
echo -e "${GREEN}✅ Environment setup complete!${NC}"
echo -e "${YELLOW}🔔 Don't forget to fill in your actual configuration values${NC}"
echo ""
echo "📖 For detailed deployment instructions, see DEPLOYMENT.md" 