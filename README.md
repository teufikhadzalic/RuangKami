# RuangKami

> A full-stack room booking and assignment management system designed for organizations, with role-based access and a clean user experience, built with React (Vite) frontend and Node.js/Express backend, using MongoDB Atlas as the database.

![Dockerized](https://img.shields.io/badge/dockerized-yes-blue)
![Made With](https://img.shields.io/badge/Made%20with-React%20%26%20Node.js-blue.svg)

---

## 📚 Table of Contents

- [Team Members](#team-members)
- [Features](##features)
- [Tech Stack](#tech-stack)
- [Quick Start (Docker)](#quick-start-recommended-docker-compose)
- [Manual Development](#manual-development-without-docker)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

---

## Creator
- Teufik Ali Hadzalic (2306267012)

---

## 🚀 Features

**RuangKami** is a web-based platform tailored for student organizations with multiple internal divisions. It streamlines event planning, room bookings, and assignment workflows through role-based access and intelligent scheduling.

---

#### 🔐 User Authentication & Role-Based Access Control

RuangKami supports three distinct user roles, each with clearly defined permissions:

- **Pemimpin (Organization Leader)**
  - The highest-level role with full system access.
  - No division selection is required upon registration (only one Pemimpin per organization).
- **Pemimpin Divisi (Division Leader)**
  - Division-specific leader with intermediate access rights.
  - Chooses a division at registration.
- **Anggota Divisi (Division Member)**
  - Regular division member with limited access.
  - Also chooses a division at registration.

Secure authentication ensures users can only access features permitted by their role.

---

#### 🧑‍🤝‍🧑 User Role Capabilities

##### 📘 Anggota Divisi

- View all assignments delegated by the organization leader (*Pemimpin*).
- Access a centralized schedule for:
  - Upcoming assignments.
  - Booked events and their room locations.
- View personal profile and division information.
- Cannot create, modify, or submit assignments.
- Cannot book or manage rooms.

##### 📗 Pemimpin Divisi

- Full access to everything available to *Anggota Divisi*.
- Can book rooms for division-specific activities.
- View and manage a list of all previous room bookings by their division.
- Submit or mark an assignment as completed on behalf of the division.

##### 📕 Pemimpin

- Full system-wide administrative privileges.
- Assign tasks to division leaders (*Pemimpin Divisi*).
- View the complete room booking history across the organization.
- Access analytics and statistics:
  - Room utilization metrics.
  - Spending overview based on bookings and electricity usage.
- Add new rooms or remove existing rooms from the system.

---

#### 🏢 Room Management & Booking System

- 📋 **Room Listings**  
  Browse available rooms by building, each displaying:
  - Room capacity.
  - Available facilities (e.g., chairs, projectors, AC units, whiteboards).
  - Base rental cost.

- 🧮 **Dynamic Cost Calculation**  
  When booking a room, the total cost is calculated automatically, including:
  - Base room cost.
  - Additional charges for extra electricity usage (e.g., more ACs, lamps, or electronic equipment).

- 📅 **Room Booking Process**
  - Only *Pemimpin Divisi* can make room bookings for their division.
  - Availability calendar shows conflicting bookings to prevent double-booking.
  - Bookings can include details like purpose, expected attendance, and equipment needed.

- 📖 **Booking History**
  - *Pemimpin Divisi*: See division-specific past bookings.
  - *Pemimpin*: Access a global booking log for the entire organization.

- 🛠️ **Room Management (Admin)**
  - *Pemimpin* can:
    - Add new rooms to the system.
    - Remove outdated or unavailable rooms.
    - Modify room details (capacity, facilities, base cost).

---

#### 📝 Assignment Management

- 🎯 **Assignment Creation**
  - Only *Pemimpin* can create assignments and assign them to specific divisions.
  - Each assignment includes:
    - Title and description.
    - Deadline.
    - Division target.
    - Optional location info (linked to a room).

- 🧩 **Assignment Delegation & Submission**
  - *Pemimpin Divisi* can mark an assignment as completed on behalf of their division.
  - Submission timestamps are recorded.
  - *Anggota Divisi* cannot submit but can collaborate offline and track assignment progress.

- 📊 **Assignment Tracking**
  - Users can view upcoming and completed tasks.
  - A calendar view highlights deadlines.
  - Optional integration with booked room schedules.

---

#### 📅 Schedule & Event Timeline

- Visual calendar or list view of:
  - Assigned tasks and deadlines.
  - Booked rooms and their usage times.
  - Event locations tied to room bookings.

This feature allows all roles to stay aware of upcoming organizational activities and their logistics.

---

#### 👤 Profile Management

- Users can access and edit their personal profile:
  - Name, role, and division.
  - Contact information (optional).
  - Account settings.

- Profile data is role-sensitive:
  - *Pemimpin Divisi* and *Anggota Divisi* profiles include division-specific details.
  - *Pemimpin* profiles are organization-level.

---

#### 📈 Statistics & Analytics (Pemimpin Only)

- Access summarized data on:
  - Booking frequency per room.
  - Division-level room usage.
  - Cumulative spending across all bookings and added electricity costs.

Helps organization leaders make informed decisions about space utilization and budgeting.

---

#### 🌐 Miscellaneous Features

- 🧭 **Navigation Menu** adapts dynamically based on user role.
- 🔄 **Real-time Role-Based View Control** ensures users never access unauthorized features.
- ✨ **Responsive Design** for desktop and mobile devices.

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

**Assignments**
![](https://i.imgur.com/BfjguDV.png)

**Schedule**
![](https://i.imgur.com/SsPYahL.png)

**Room Booking**
![](https://i.imgur.com/bA2qx5L.png)

**My Bookings**
![](https://i.imgur.com/TZfiqGA.png)

**Booking History and Statistics**
![](https://i.imgur.com/xzwKMCX.png)

**Room Management**
![](https://i.imgur.com/GLFZjTL.png)

**Profile**
![](https://i.imgur.com/ciK0VmG.png)

## 👥 Contributing

Contributions are welcome!
Feel free to open issues or submit pull requests to help improve the project.

---
