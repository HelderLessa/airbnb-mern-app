Airbnb Clone (MERN Stack)
This project is a full-stack Airbnb clone built with the MERN stack (MongoDB, Express, React, Node.js). It replicates some of the core features of Airbnb, allowing users to browse, book, and list properties for rent.

Features:
User registration and login (authentication using JWT).
Secure password storage with bcrypt.
List properties for rent with features like pricing, photos, and description.
Upload photos for properties.
Browse and book available properties.
View booking history for each user.
Fully responsive front-end built with React.
REST API for handling bookings, users, and properties.

Technologies Used:
- Frontend:
React: Modern JavaScript library for building user interfaces.
Tailwind CSS: Utility-first CSS framework for styling the UI.
Axios: Promise-based HTTP client to handle API requests.
date-fns: Utility library for manipulating and formatting dates.
- Backend:
Node.js: JavaScript runtime for building fast, scalable network applications.
Express.js: Web framework for building the REST API.
MongoDB: NoSQL database for storing user and property data.
Mongoose: ODM library to interact with MongoDB from Node.js.
JWT: JSON Web Tokens for secure user authentication.
bcrypt.js: Library for hashing user passwords.
Multer: Middleware for handling file uploads.
cookie-parser: Middleware for parsing cookies in requests.
image-downloader: Library for downloading images from external sources.

Project Structure:
/client: Contains the front-end React code.
/api: Contains the back-end Express API with routes for users, bookings, and properties.
/uploads: Stores uploaded images for properties.
