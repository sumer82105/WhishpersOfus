# Whispers of Us 💕

A romantic web application for couples to share memories, wishes, love notes, and surprises.

## Features

- 💌 **Love Notes**: Send heartfelt messages to your partner
- 📸 **Photo Moments**: Share and organize your favorite memories
- 🌟 **Wishes**: Create and track your shared dreams and goals
- 🎁 **Surprises**: Plan and unlock special surprises for each other
- 🔐 **Secure Authentication**: Firebase-based user authentication
- 📱 **Responsive Design**: Beautiful UI that works on all devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Firebase** for authentication
- **Cloudinary** for media uploads

### Backend
- **Spring Boot 3** with Java 17
- **MongoDB** for data persistence
- **Firebase Admin SDK** for authentication
- **Maven** for dependency management

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/whispers-of-us.git
cd whispers-of-us
```

### 2. Environment Setup

**For Windows:**
```powershell
.\setup-env.ps1
```

**For Linux/Mac:**
```bash
chmod +x setup-env.sh
./setup-env.sh
```

This will create `.env` files from the examples. You'll need to fill in your actual configuration values.

### 3. Configure Services

You'll need to set up:
- **Firebase Project** (Authentication)
- **MongoDB Atlas** (Database)
- **Cloudinary** (Media uploads)

See `DEPLOYMENT.md` for detailed setup instructions.

### 4. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
./mvnw install
```

### 5. Run the Application

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## Environment Variables

### Frontend (.env)
```bash
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Backend (.env)
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
FIREBASE_PROJECT_ID=your_firebase_project_id
JWT_SECRET=your_very_long_and_secure_secret_key
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## Deployment

This application is configured for easy deployment to:
- **Frontend**: Vercel
- **Backend**: Render

See `DEPLOYMENT.md` for complete deployment instructions.

### Production URLs
- Frontend: Deploy to Vercel
- Backend: Deploy to Render
- Database: MongoDB Atlas

## Project Structure

```
whispers-of-us/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   └── config/         # Configuration files
│   ├── .env.example        # Environment variables template
│   ├── vercel.json         # Vercel deployment config
│   └── package.json
├── backend/                 # Spring Boot application
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Resources and config
│   ├── .env.example        # Environment variables template
│   ├── render.yaml         # Render deployment config
│   ├── Dockerfile          # Docker configuration
│   └── pom.xml
├── DEPLOYMENT.md           # Detailed deployment guide
├── setup-env.sh           # Environment setup script (Linux/Mac)
├── setup-env.ps1          # Environment setup script (Windows)
└── README.md
```

## Security Features

- ✅ Environment variables for all sensitive data
- ✅ Firebase authentication integration
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Secure file uploads via Cloudinary
- ✅ JWT token management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For deployment help or issues:
1. Check `DEPLOYMENT.md` for detailed instructions
2. Verify all environment variables are set correctly
3. Check service logs for error details
4. Create an issue with detailed information about the problem

---

Made with ❤️ for couples who want to cherish their special moments together. 