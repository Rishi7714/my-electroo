# My Electroo ⚡
### Your One-Stop Tech Shop (MERN Stack)

**My Electroo** is a full-featured, responsive e-commerce platform specifically designed for the Indian electronics market. Built using the MERN stack, it features a dynamic frontend, secure user authentication, and a robust admin dashboard for managing inventory and orders.

---

## 🚀 Key Features

### **User Experience**
* **Indian Localization:** Prices displayed in Indian Rupees (₹) and localized contact/address details.
* **Product Search & Filtering:** Dynamic search bar in the header and side-bar category/price filters.
* **Featured Products:** Highlights the costliest items per category on the homepage in a 3-3 grid layout.
* **Shopping Cart:** Persistent cart state using React Context API.
* **User Profile:** Order history tracking and profile management.
* **Checkout System:** Multi-step checkout with shipping details and payment method selection.

### **Admin Capabilities**
* **Product Management:** Full CRUD (Create, Read, Update, Delete) functionality with image uploads using Multer.
* **Order Management:** Track customer orders and update shipping/delivery status.
* **Admin Dashboard:** Overview of sales performance and revenue metrics.

### **Security & Technical**
* **Authentication:** JWT (JSON Web Tokens) for secure session management.
* **Password Hashing:** BcryptJS for one-way secure password storage.
* **Responsive Design:** Fully optimized for mobile, tablet, and desktop views.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, React Router, CSS3 (Flexbox/Grid), Context API.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB with Mongoose ODM.
* **File Storage:** Multer (for product image uploads).
* **Auth:** BcryptJS & JWT.

---

## 📂 Project Structure

```text
myelectro/
├── client/             # React frontend
│   ├── src/
│   │   ├── components/ # Reusable UI (Header, Footer, ProductCard)
│   │   ├── context/    # State management (Auth, Cart)
│   │   ├── pages/      # View components (Home, Products, Admin, etc.)
│   │   └── App.js      # Main routing
├── server/             # Node.js backend
│   ├── controllers/    # Logic for handling requests
│   ├── models/         # MongoDB Schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth and error handling
│   └── uploads/        # Stored product images
└── README.md
