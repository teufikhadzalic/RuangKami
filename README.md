# RuangKami

> A full-stack room booking and assignment management system designed for organizations, with role-based access and a clean user experience, built with React (Vite) frontend and Node.js/Express backend, using MongoDB Atlas as the database.

![Dockerized](https://img.shields.io/badge/dockerized-yes-blue)
![Made With](https://img.shields.io/badge/Made%20with-React%20%26%20Node.js-blue.svg)

---

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#-tech-stack)
- [Quick Start (Docker)](#quick-start-recommended-docker-compose)
- [Manual Development](#manual-development-without-docker)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## 🚀 Features

- 🔐 User authentication with role-based access (`Pemimpin`, `Pemimpin Divisi`, `Anggota Divisi`)
- 🏢 Room management and booking system
- 📝 Assignment creation and submission tracking
- 👤 Profile management

---

## 🛠 Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **Containerization:** Docker, Docker Compose

---

## ⚡ Quick Start (Recommended): Docker Compose

> ⚠️ **Note:** Ensure Docker Desktop is installed and running before proceeding.

1. **Clone the repository**
   ```sh
   git clone https://github.com/teufikhadzalic/RuangKami.git
   cd RuangKami-coolbranch
   ```

2. **Configure environment variables**
   - Make sure `backend/.env` contains your MongoDB Atlas URI and desired port:
     ```
     PORT=4000
     MONGO_URI=your-mongodb-atlas-uri
     ```
   - (Optional) Edit `frontend/.env` if you want to change the API URL (default is `http://localhost:4000`).

3. **Build and run everything**
   ```sh
   docker compose up --build
   ```

4. **Access the app**
   - Frontend: [http://localhost](http://localhost)
   - Backend API: [http://localhost:4000](http://localhost:4000)

---

## 🧪 Manual Development (Without Docker)

### Backend

```sh
cd backend
npm install
npm start
```

### Frontend

```sh
cd frontend
npm install
npm run dev
```

- The frontend dev server runs at [http://localhost:5173](http://localhost:5173) by default.
- Make sure your backend CORS settings allow this origin for local development.

---

## 🔧 Environment Variables

### Backend (`backend/.env`)
```
PORT=4000
MONGO_URI=your-mongodb-atlas-uri
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:4000
```

---

## 🛠️ Troubleshooting

- **CORS errors:**  
  Ensure your backend allows requests from both `http://localhost` and `http://localhost:5173` in development.
- **MongoDB connection issues:**  
  Double-check your `MONGO_URI` in `backend/.env`.

---

## 📸 Screenshots

**Dashboard**

![](https://i.imgur.com/RlsjpX6.png)

**Statistics**

![](https://i.imgur.com/xzwKMCX.png)

## 👥 Contributing

Contributions are welcome!
Feel free to open issues or submit pull requests to help improve the project.

---