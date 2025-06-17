# PowerShell Environment Setup Script for Whispers of Us
Write-Host "🚀 Setting up Whispers of Us Environment Configuration" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Function to check if file exists
function Test-FileExists {
    param($FilePath)
    if (Test-Path $FilePath) {
        Write-Host "✓ $FilePath exists" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ $FilePath missing" -ForegroundColor Red
        return $false
    }
}

# Function to copy example file if .env doesn't exist
function Setup-EnvFile {
    param($Directory)
    $ExampleFile = Join-Path $Directory ".env.example"
    $EnvFile = Join-Path $Directory ".env"
    
    if (-not (Test-Path $EnvFile)) {
        if (Test-Path $ExampleFile) {
            Copy-Item $ExampleFile $EnvFile
            Write-Host "✓ Created $EnvFile from example" -ForegroundColor Green
            Write-Host "⚠  Please edit $EnvFile with your actual values" -ForegroundColor Yellow
        } else {
            Write-Host "✗ $ExampleFile not found" -ForegroundColor Red
        }
    } else {
        Write-Host "✓ $EnvFile already exists" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "📁 Checking project structure..." -ForegroundColor White
Write-Host "================================" -ForegroundColor White

# Check if we're in the right directory
if (-not ((Test-Path "frontend") -and (Test-Path "backend"))) {
    Write-Host "Error: Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "Expected structure:"
    Write-Host "  ├── frontend/"
    Write-Host "  ├── backend/"
    Write-Host "  └── setup-env.ps1"
    exit 1
}

Write-Host "✓ Project structure looks good" -ForegroundColor Green

Write-Host ""
Write-Host "🔧 Setting up environment files..." -ForegroundColor White
Write-Host "=================================" -ForegroundColor White

# Setup frontend environment
Write-Host "Frontend:" -ForegroundColor Cyan
Setup-EnvFile "frontend"

# Setup backend environment  
Write-Host "Backend:" -ForegroundColor Cyan
Setup-EnvFile "backend"

Write-Host ""
Write-Host "📋 Configuration Checklist" -ForegroundColor White
Write-Host "=========================" -ForegroundColor White
Write-Host ""
Write-Host "Frontend (.env):" -ForegroundColor Cyan
Write-Host "  [ ] REACT_APP_API_BASE_URL - Your backend URL"
Write-Host "  [ ] REACT_APP_FIREBASE_* - Firebase configuration"
Write-Host "  [ ] REACT_APP_CLOUDINARY_* - Cloudinary configuration"
Write-Host ""
Write-Host "Backend (.env):" -ForegroundColor Cyan
Write-Host "  [ ] MONGODB_URI - MongoDB connection string"
Write-Host "  [ ] FIREBASE_PROJECT_ID - Firebase project ID"
Write-Host "  [ ] JWT_SECRET - Secure random string"
Write-Host "  [ ] CORS_ALLOWED_ORIGINS - Frontend URL"
Write-Host ""
Write-Host "📚 Additional Setup Required:" -ForegroundColor White
Write-Host "============================" -ForegroundColor White
Write-Host ""
Write-Host "1. 🔥 Firebase Setup:" -ForegroundColor Yellow
Write-Host "   - Create project at https://console.firebase.google.com"
Write-Host "   - Enable Authentication (Email/Password)"
Write-Host "   - Download service account key to backend/src/main/resources/"
Write-Host ""
Write-Host "2. 🍃 MongoDB Setup:" -ForegroundColor Yellow
Write-Host "   - Create cluster at https://cloud.mongodb.com"
Write-Host "   - Add database user and get connection string"
Write-Host "   - Whitelist IP addresses for access"
Write-Host ""
Write-Host "3. ☁️  Cloudinary Setup:" -ForegroundColor Yellow
Write-Host "   - Create account at https://cloudinary.com"
Write-Host "   - Get cloud name and create upload preset"
Write-Host ""
Write-Host "4. 🚀 For Deployment:" -ForegroundColor Yellow
Write-Host "   - Frontend: Deploy to Vercel (connect GitHub repo)"
Write-Host "   - Backend: Deploy to Render (connect GitHub repo)"
Write-Host "   - Set environment variables in respective dashboards"
Write-Host ""
Write-Host "✅ Environment setup complete!" -ForegroundColor Green
Write-Host "🔔 Don't forget to fill in your actual configuration values" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 For detailed deployment instructions, see DEPLOYMENT.md" 