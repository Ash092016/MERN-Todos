# 📝 MERN Task Manager

A premium, full-stack Todo application built with the MERN stack (MongoDB, Express, React, Node.js). This application features a sleek dark mode, secure user authentication, and a responsive design optimized for all devices.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based login and signup with password hashing.
- **✅ Task Management**: Create, read, update, and delete tasks with ease.
- **📅 Smart Filtering**: Filter tasks by the date they were created.
- **🌓 Dynamic Theme**: Beautifully designed UI with a native dark mode toggle.
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile viewing.
- **⚡ Real-time Updates**: Smooth UI transitions and immediate feedback on actions.

## 🚀 Tech Stack

### Frontend
- **React (Vite)**: For a lightning-fast development experience.
- **Tailwind CSS**: For premium, modern styling.
- **Axios**: For seamless API communication.
- **Context API**: Global state management for Auth and Theme.

### Backend
- **Node.js & Express**: High-performance backend routing.
- **MongoDB & Mongoose**: Scalable NoSQL database management.
- **jsonwebtoken (JWT)**: Secure user session management.
- **bcryptjs**: Industrial-strength password encryption.

## 🛠️ Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ash092016/MERN-Todos.git
   cd MERN-Todos
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

## 🌐 Deployment (Vercel)

This project is optimized for deployment on Vercel as two separate services (Backend and Frontend).

### Backend Configuration
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Output Directory**: `.`
- **Environment Variables**:
  - `MONGODB_URI`: Your MongoDB connection string.
  - `JWT_SECRET`: A secure random string.
  - `ALLOWED_ORIGIN`: https://mern-todos-theta.vercel.app/

### Frontend Configuration
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Environment Variables**:
  - `VITE_API_URL`: https://mern-todos-iegh.vercel.app/

## 📄 License

This project is open-source and available under the [ISC License](LICENSE).
