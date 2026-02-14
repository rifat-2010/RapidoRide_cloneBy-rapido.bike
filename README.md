# 🚖 RapidoRide - Next Gen Ride Sharing Platform

<div align="center">
  <img src="https://media.assettype.com/eisamay%2Fimport%2Fthumb%2F100469868%2F100469868.jpg?w=480&auto=format%2Ccompress&fit=max" alt="RapidoRide Banner" width="100%" />
  
  <br />
  
[![Client Live](https://img.shields.io/badge/Client_Live-Visit_Site-orange?style=for-the-badge&logo=netlify)](https://rapido-ride.netlify.app/)

[![Backend Live](https://img.shields.io/badge/Backend_Live-Visit_Server-green?style=for-the-badge&logo=vercel)](https://rapido-ride-six.vercel.app/)

  <p align="center">
    <b>Experience the future of urban mobility. Fast, reliable, and secure ride-sharing.</b>
  </p>
</div>

---

## 📖 Introduction

**RapidoRide** is a fully functional, full-stack ride-hailing application designed to connect passengers (Users) with drivers (Captains) seamlessly. Built with the **MERN Stack** (MongoDB, Express.js, React, Node.js), it features a modern, responsive user interface and a robust backend for real-time data persistence.

The platform distinguishes itself with a sleek "Anti-Gravity" aesthetic and a dual-role system that allows users to switch between booking rides and driving.

## ✨ Key Features

### 🎨 Frontend (Client)

- **Modern User Interface**: Built with **React** and **Vite** for lightning-fast performance.
- **Responsive Design**: Fully responsive layout optimized for Mobile, Tablet, and Desktop using **Tailwind CSS**.
- **Interactive Maps & Location**: Integrated location services (simulated/API) for pickup and drop-off selection.
- **Dynamic Role Switching**: innovative architecture supporting distinct User and Captain interfaces within a single SPA.
- **Real-time Status Updates**: Visual indicators for ride status (Searching, Accepted, In-progress, Completed).
- **Authentication**: Secure Login and Signup flows with phone number verification.

### ⚙️ Backend (Server)

- **RESTful API**: Scalable Node.js & Express.js architecture.
- **Database**: **MongoDB Atlas** cloud database integration for secure and persistent data storage.
- **Data Collections**:
  - `userCollection`: Stores user profiles and roles.
  - `rideCollection`: Manages ride requests, status, fare, and coordinates.
  - `captainCollection`: Tracks driver profiles, vehicle details, online status, and earnings.
- **CORS Enabled**: Secure cross-origin resource sharing between client and server.

---

## 👥 Role-Based Workflows

RapidoRide is capable of handling two primary user roles with distinct functionalities.

### 1. 👤 User (Passenger) Flow

The User role is designed for passengers looking to book a ride comfortably.

- **Registration/Login**: Users sign up using their phone number. A default 'USER' role is assigned.
- **Booking a Ride**:
  - **Set Location**: Users enter their Pickup and Drop-off locations.
  - **Review Fare**: The app calculates and displays the estimated fare and distance.
  - **Confirm Booking**: Clicking "Confirm Ride" sends a request to the backend with status `SEARCHING`.
- **Ride Management**:
  - **Waiting for Captain**: The user sees a "Looking for a Driver" animation.
  - **Ride Accepted**: Once a Captain accepts, the user sees the Captain's details (Vehicle Model, Plate Number, Rating).
  - **Live Tracking**: Users can track the ride progress (simulated).
- **Completion**: After the ride, users receive a ride summary.

### 2. 🏍️ Rider (Captain/Driver) Flow

The Captain role is for drivers who want to earn by accepting rides.

- **Onboarding**: Users with the 'RIDER' role access the Captain Dashboard.
- **Online/Offline Toggle**: Captains can toggle their availability status. They only receive requests when `Online`.
- **Ride Requests**:
  - **Incoming Function**: When a nearby User requests a ride, the Captain receives a pop-up notification with trip details (Distance, Fare, Pickup Location).
  - **Accept/Reject**: Captains can accept the ride to secure it or ignore it.
- **Ride Execution**:
  - **Navigate to Pickup**: Captain sees the user's location.
  - **Start Ride**: Verifies OTP (if enabled) and starts the journey.
  - **Complete Ride**: specific action to mark the ride as finished and collect payment.
- **Earnings Dashboard**: Tracks daily earnings, total rides completed, and driver rating.

---

## 🚀 Getting Started (Run Locally)

Follow these instructions to run the project on your local machine for development.

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB Atlas** URI (or local MongoDB instance)

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/RapidoRide_cloneBy-rapido.bike.git
    cd RapidoRide_cloneBy-rapido.bike
    ```

2.  **Install Dependencies**
    Note: You may need to run this in both the root (if concurrently is set up) or individual folders if separated.

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your configurations (optional if hardcoded for dev):

    ```env
    VITE_API_URL=https://rapido-ride-six.vercel.app/api
    ```

4.  **Run the Application**
    Start both the Frontend and Backend servers concurrently:

    ```bash
    npm run dev
    ```

    - **Frontend**: `http://localhost:5173`
    - **Backend**: `http://localhost:4000`

---

## 🛠️ Project Structure

```bash
├── components/       # Reusable UI Components
├── contexts/         # React Context (Auth, App State)
├── services/         # API Service (Axios/Fetch calls)
├── views/            # Main Page Views (RiderApp, CaptainApp, Website)
├── server.js         # Backend Entry Point & API Routes
├── App.tsx           # Main Application Router
└── README.md         # Project Documentation
```

<div align="center">
  <sub>Built with ❤️ by Rifatuzzaman Rifat</sub>
</div>
F
