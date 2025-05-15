# 🏡 Airbnb Clone (MERN Stack)

This project is a full-featured **Airbnb clone built with the MERN stack (MongoDB, Express, React, Node.js)**. It replicates core Airbnb functionalities, including property listing, user authentication, booking management, and image uploads.

> ⚠️ This is a personal project created for learning purposes. It is not affiliated with Airbnb, Inc.

---

## 🚀 Features

- 🔐 **User Authentication**  
  Secure login, registration, and token-based session management using JWT and cookies.

- 🏘️ **Place Management**  
  Users can create, edit, and delete their own listings (places) with detailed information and multiple photos.

- 📅 **Booking System**  
  Users can book available listings and view or cancel their own reservations.

- 📦 **Image Uploads**  
  Supports uploading images from local files or URLs using **Multer** and **Cloudinary**.

- 🧾 **Dashboard**  
  Logged-in users can manage their listings and see a list of their current or past bookings.

---

## 🛠️ Tech Stack

### Frontend

- ⚛️ **React 18**
- 🌐 **React Router DOM**
- 🎨 **Tailwind CSS** – utility-first styling
- 📆 **date-fns** – date formatting
- 🔗 **Axios** – HTTP requests to backend API
- ⚙️ **Vite** – blazing-fast dev server and build tool

### Backend

- 🌐 **Express.js** – server and routing
- 🔒 **jsonwebtoken** – authentication with JWT
- 🥇 **Mongoose** – MongoDB object modeling
- ☁️ **Cloudinary** – image hosting and storage
- 🧊 **Multer** – file upload handling
- 🔑 **bcryptjs** – password hashing
- 🌍 **CORS** – cross-origin resource sharing
- 🍪 **cookie-parser** – handling secure auth cookies
- 🧾 **dotenv** – environment config

---

🧠 Key Concepts

- Uses JWT tokens stored in cookies for persistent login.

- Frontend consumes secure API routes with Axios.

- State management is handled via React Context API (no Redux).

- Uploads are stored in Cloudinary via Multer.
