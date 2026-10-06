# Product Management System (Full Stack)

A full-stack web application for managing products, categories, stock, and inventory pricing in real time. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and Vite.

---

## 🔗 Live Demo & Links

* **Frontend Deployment:** [https://gupio-product-management.vercel.app/](https://gupio-product-management.vercel.app/)
* **Backend API Base URL:** [https://gupio-product-management.onrender.com/](https://gupio-product-management.onrender.com/)
* **API Products Endpoint:** [https://gupio-product-management.onrender.com/api/products](https://gupio-product-management.onrender.com/api/products)
* **GitHub Repository:** [https://github.com/SinchanaRG26/gupio-product-management](https://github.com/SinchanaRG26/gupio-product-management)

---

## 🚀 Features

* **Full CRUD Operations:** Create, Read, Update, and Delete products seamlessly with real-time UI updates.
* **Product Catalog Display:** Card-based UI showing product name, category, price, description, image, and stock status.
* **Dynamic Stock Badges:** Automatic visual indicators for stock availability (e.g., remaining stock count).
* **Search & Filter:** Search products by name or filter items by category dynamically.
* **Responsive UI:** Clean, modern interface designed to work smoothly on both desktop and mobile devices.
* **Cloud Database Persistence:** Integrated with MongoDB Atlas for persistent data storage across browser sessions.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React.js (Bootstrapped with Vite)
* **Styling:** CSS3 / Modern UI Layouts
* **Deployment:** Vercel

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database Driver:** Mongoose (ODM)
* **Deployment:** Render

### Database
* **Database:** MongoDB Atlas (Cloud Cluster hosted on AWS ap-south-1)

---

## 📁 Repository Structure

```text
gupio-product-management/
├── backend/
│   ├── models/          # Mongoose database schemas (Product.js)
│   ├── routes/          # Express API route handlers (productRoutes.js)
│   ├── .env.example     # Sample environment variables template
│   ├── package.json     # Backend dependencies and start scripts
│   └── server.js        # Main Express server configuration & MongoDB connection
├── frontend/
│   ├── src/             # React component hierarchy, services, and hooks
│   ├── public/          # Static assets and favicon
│   ├── package.json     # Frontend dependencies and Vite scripts
│   └── vite.config.js   # Vite configuration file
└── README.md            # Project documentation
