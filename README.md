# Fixr (Spurhacks Project)

Fixr is a full-stack application that connects users with verified home repair professionals. Users can capture images of household issues, receive AI-powered diagnostics, and book local technicians—all from a modern, mobile-friendly interface. Worked on this project ion collaboration with [Pedro Faraco](https://github.com/itsPedro231), [Shaurya Santosh](https://github.com/shawarma-s) and [Aldin Fazlic](https://github.com/aldinfaz)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Features

- **AI-Powered Diagnostics:** Upload images of household problems and receive instant analysis using Google Gemini Vision API.
- **Real-Time Technician Booking:** Browse, filter, and book verified professionals based on specialty, rating, and proximity.
- **Secure Authentication:** JWT-based user authentication and protected routes.
- **Modern Mobile UI:** Built with Expo, React Native, and a component-driven architecture.
- **Seamless API Integration:** FastAPI and Express.js backend with MongoDB for data storage.

---

## Tech Stack

### Frontend

- **React Native** (with Expo)
- **Expo Router** (navigation)
- **TypeScript**
- **React Navigation**
- **Axios** (API requests)
- **Lucide React Native** (icons)
- **@expo/vector-icons**
- **@expo-google-fonts/inter**
- **AsyncStorage** (local storage)
- **Expo Camera, Image Picker, Haptics, Linear Gradient, Splash Screen, Status Bar, Web Browser, Blur, System UI, Symbols**

### Backend

#### Node.js/Express API

- **Express.js** (REST API)
- **Mongoose** (MongoDB ODM)
- **MongoDB** (database)
- **JWT** (authentication)
- **Bcrypt** (password hashing)
- **CORS**
- **Dotenv**

#### Python/FastAPI Microservice

- **FastAPI** (image analysis API)
- **Uvicorn** (ASGI server)
- **Google Gemini Vision API** (AI diagnostics)
- **Python-dotenv**
- **Pydantic**
- **Starlette**
- **Requests**
- **GRPC, Google Auth, Google API Client** (for Google AI integration)

---

## Setup & Installation

### 1. Backend

```bash
cd backend
# Node.js/Express server
npm install
node server.js

# Python/FastAPI microservice
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend

```bash
# From project root
npm install
npm run dev
```

### 3. Environment Variables

Create a `.env` file in `backend/` with:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_gemini_api_key
```

---

## License

MIT

---

Let me know if you want this written directly to your `README.md` or if you want to customize any section!
