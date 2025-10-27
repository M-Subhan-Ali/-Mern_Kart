# 🛒 MERN KART

**MERN KART** is a modern **e-commerce platform** built with the MERN stack for the backend and **Next.js** for the frontend.  
It supports **both buyers and sellers**, allowing users to create accounts, list products, browse items, and manage carts.  
The project is styled with **Tailwind CSS** and does **not** use Redux — instead, it uses clean state management with Context/API integration.

---

## 🚀 Features

- 👤 **User Authentication & Roles**
  - Register/login as **buyer** or **seller**
  - Secure JWT-based authentication
- 🏬 **Seller Features**
  - Create and manage products
  - Upload product details (title, description, price, images, category)
- 🛍️ **Buyer Features**
  - Browse and search products
  - Add/remove/update items in cart
  - Checkout flow (future scope: orders & payments)
- 🛒 **Cart Management**
  - Add products to cart
  - Update quantities
  - Clear/remove items
- 🎨 **Modern UI**
  - Responsive design built with **Tailwind CSS**
  - Clean product cards, forms, and dashboards
- ⚡ **Next.js Frontend**
  - Server-side rendering (SSR) & routing
  - Optimized performance
- 🗄️ **MERN Backend**
  - Express API with MongoDB (Mongoose)
  - Models: **User**, **Product**, **Cart**

---

## 🛠️ Tech Stack

- **Frontend**

  - [Next.js](https://nextjs.org/) (React Framework)
  - [Tailwind CSS](https://tailwindcss.com/) (utility-first styling)

- **Backend**

  - [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
  - [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) (ODM)

- **Auth & State**
  - JWT Authentication
  - No Redux — handled via Context API / local state

---

## 📂 Models

### 🧑 User Model

- Name, Email, Password (hashed)
- Role: `buyer` | `seller`
- Account management fields

### 📦 Product Model

- Title, Description, Price, Images
- Category
- Stock

### 🛒 Cart Model

- User reference
- Product references
- Quantity, subtotal
