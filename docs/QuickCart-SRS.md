# Software Requirements Specification (SRS)
## QuickCart – Online Grocery Shopping and Order Management System

**Prepared by:** Aman Shrivastav  
**Course:** MCA  
**Project Type:** Full-Stack Web and Android Application  
**Version:** 1.0  
**Date:** 04 October 2026

---

## 1. Introduction

### 1.1 Purpose

QuickCart is an online grocery shopping system developed to make the process of finding groceries, adding products to a cart, placing orders, and checking previous orders simple for customers.

The project also provides an admin side for managing products, viewing orders, checking basic business statistics, and updating order status.

The application is available as a responsive web application and can also be packaged as an Android application.

### 1.2 Problem Statement

In a small grocery business, customers may have to visit the store or depend on phone/WhatsApp-based ordering. Such methods make product discovery, cart management, order tracking, and record keeping difficult.

QuickCart provides a single system where customers can browse products and place orders while the application stores customer and order information in a database.

### 1.3 Objectives

The main objectives of QuickCart are:

- Provide a simple online grocery shopping interface.
- Allow customers to create accounts and securely log in.
- Provide product search, categories, sorting, and wishlist functionality.
- Allow customers to manage a shopping cart.
- Provide checkout with customer address and phone validation.
- Support Cash on Delivery (COD).
- Store orders and order items in PostgreSQL.
- Allow customers to view their order history.
- Provide an admin dashboard for order management and basic statistics.
- Maintain product stock during order processing.
- Make the application usable on mobile devices.
- Provide an Android application build using Capacitor.

### 1.4 Scope

The current system covers customer registration/login, grocery browsing, wishlist, cart, checkout, order creation, order history, product stock management, and admin order management.

Payment gateway integration, live delivery tracking, and production SMS activation are outside the current project scope.

---

## 2. Overall Description

### 2.1 Product Perspective

QuickCart follows a client-server architecture.

The main parts are:

1. Frontend – React/Vite based customer and admin interface.
2. Backend – Node.js and Express REST API.
3. Database – PostgreSQL for persistent application data.
4. Android Layer – Capacitor wrapper for the web application.
5. Hosting – Render for the deployed frontend, backend, and PostgreSQL database.
6. Source Control / CI – GitHub and GitHub Actions.

The general flow is:

Customer → Frontend → Backend API → PostgreSQL Database

For Android:

Android App → Capacitor → QuickCart Frontend → Backend API → PostgreSQL

### 2.2 User Classes

#### Customer
A normal user who can:

- Register and log in.
- Browse grocery products.
- Search and filter products.
- Add products to wishlist.
- Add/update/remove cart items.
- Enter delivery details.
- Place COD orders.
- View previous orders.

#### Administrator
An authorized administrator who can:

- View application statistics.
- View customer orders.
- Check customer information associated with orders.
- Update order status.
- Monitor basic product/order activity.

### 2.3 Operating Environment

The web application can be accessed through a modern browser on Android phones, Windows/Linux/macOS computers, and other modern browsers supporting JavaScript.

The Android version requires a compatible Android device.

The production backend and frontend are hosted online.

---

## 3. Functional Requirements

### FR-01: User Registration
The system shall allow a new customer to create an account using required personal information and credentials.

### FR-02: User Login
The system shall authenticate registered users and provide a session using JWT-based authentication.

### FR-03: Product Listing
The system shall display available grocery products with product name, category, price, stock-related information, and visual representation.

### FR-04: Product Search
The system shall allow customers to search for products by relevant product information.

### FR-05: Category Browsing
The system shall allow customers to browse products by category.

### FR-06: Product Sorting
The system shall provide price-based sorting so that customers can arrange products according to price.

### FR-07: Wishlist
The system shall allow logged-in customers to add products to and manage a wishlist.

### FR-08: Cart Management
The system shall allow customers to add products, increase or decrease quantity, remove cart items, and review the current cart before checkout.

### FR-09: Checkout
The system shall collect delivery information such as customer name, phone number, address, and PIN code before creating an order.

### FR-10: Delivery Charge
The system shall calculate delivery charges according to the configured order value. Orders above the configured free-delivery threshold receive free delivery.

### FR-11: Order Creation
After successful checkout, the system shall create an order and store its items, quantities, prices, delivery information, payment method, and total amount.

### FR-12: Stock Management
The system shall reduce available product stock when an order is successfully created.

### FR-13: Order History
The system shall allow customers to view their previous orders and their current status.

### FR-14: Order Status
The system shall support Confirmed, Packed, Out for delivery, Delivered, and Cancelled states.

### FR-15: Admin Dashboard
The system shall provide authorized administrators with basic statistics related to products, users, orders, and revenue.

### FR-16: Admin Order Management
The administrator shall be able to view orders and update their status.

### FR-17: Database Persistence
Customer accounts, products, carts, orders, and order items shall be persisted in PostgreSQL in the production configuration.

### FR-18: Android Application
The system shall support packaging the web application as an Android application using Capacitor.

---

## 4. Non-Functional Requirements

### 4.1 Usability
The interface should be understandable to a normal grocery customer without technical knowledge.

### 4.2 Responsiveness
The frontend should adapt to different screen sizes, especially mobile phones, tablets, and desktop screens.

### 4.3 Performance
Product browsing and normal API requests should respond without unnecessary processing or page reloads.

### 4.4 Security
The system shall use password hashing, JWT authentication, protected administrative operations, input validation, and environment variables for sensitive configuration.

### 4.5 Reliability
Order creation shall be handled as a database transaction in the PostgreSQL configuration so that stock, order, order items, and cart changes remain consistent.

### 4.6 Maintainability
The project is separated into frontend and backend applications. API-based communication makes it possible to maintain the frontend and backend independently.

### 4.7 Availability
The production application is hosted online and can be accessed whenever the hosting services are available.

---

## 5. System Architecture

### 5.1 Frontend
The frontend uses React, Vite, JavaScript, and CSS. It handles the user interface, product browsing, authentication screens, cart, checkout, order history, and admin views.

### 5.2 Backend
The backend uses Node.js, Express.js, JWT, bcryptjs, and PostgreSQL connectivity. It provides REST APIs for authentication, products, cart operations, orders, and administration.

### 5.3 Database
PostgreSQL is used for persistent storage. Main entities are Users, Products, Cart, Orders, and Order Items.

### 5.4 Android
Capacitor packages the web application into an Android project. The Android application uses the same production backend.

---

## 6. Database Requirements

### 6.1 Users
Stores user ID, name, email, password hash, role, and account creation date.

### 6.2 Products
Stores product ID, product name, category, price, product visual reference, and stock quantity.

### 6.3 Cart
Stores user ID, product ID, and quantity.

### 6.4 Orders
Stores order ID, user ID, subtotal, delivery charge, handling charge, total, delivery address, payment method, status, and creation time.

### 6.5 Order Items
Stores order ID, product ID, product name, price, quantity, and line total.

---

## 7. API Requirements

The backend provides REST endpoints for:

- Health check
- Products
- Categories
- Registration
- Login
- Current user information
- Cart
- Orders
- Admin statistics
- Admin order management

The frontend communicates with these APIs using HTTP requests.

---

## 8. User Interface Requirements

The application should provide:

1. Home / Product browsing
2. Login
3. Registration
4. Product Quick View
5. Wishlist
6. Cart
7. Checkout
8. Order confirmation
9. Order history
10. Admin dashboard
11. Admin order management

The interface should provide clear buttons, readable product information, visible prices, and mobile-friendly layouts.

---

## 9. Order Processing Flow

1. Customer registers or logs in.
2. Customer browses products.
3. Customer selects required products.
4. Products are added to the cart.
5. Customer changes quantities if required.
6. Customer opens checkout.
7. Delivery details are entered and validated.
8. System calculates subtotal, delivery, handling, and total.
9. Customer selects COD.
10. System checks product availability.
11. Order and order items are stored.
12. Product stock is reduced.
13. Cart is cleared.
14. Customer receives an order confirmation containing order details.
15. The order appears in order history.
16. Admin can update the order status.

---

## 10. Deployment

The project has been deployed using Render.

### Frontend
https://quickcart-web.onrender.com

### Backend
https://quickcart-api-prod.onrender.com

### Source Code
https://github.com/amanshrivastav8076/Repository-name-quickcart-grocery

The Android application is generated through a Capacitor-based Android project and GitHub Actions build workflow.

---

## 11. Testing Requirements

### Authentication Testing
- Register with valid information.
- Test invalid registration data.
- Login with valid credentials.
- Test incorrect credentials.

### Product Testing
- Search for products.
- Change category.
- Sort products by price.
- Open product quick view.

### Cart Testing
- Add a product.
- Increase quantity.
- Decrease quantity.
- Remove a product.
- Verify total.

### Checkout Testing
- Enter valid delivery details.
- Test invalid phone/PIN values.
- Place a COD order.
- Verify order confirmation.

### Order Testing
- Verify order history.
- Verify order status.
- Verify stock changes after successful order.

### Admin Testing
- Login as authorized admin.
- Open dashboard.
- View orders.
- Change order status.

### Mobile Testing
- Open the web application on a phone.
- Install and test the Android APK.
- Check navigation, cart, checkout, and order history on a small screen.

---

## 12. Limitations

- Only Cash on Delivery is implemented as the customer payment method.
- Online payment gateway integration is not included.
- Live delivery/GPS tracking is not included.
- SMS notification depends on the external SMS provider account and its activation requirements.
- Product management from the admin interface is limited compared with a complete commercial grocery platform.
- The current free PostgreSQL hosting arrangement is suitable for the project/demo stage but may need a different plan for long-term commercial usage.

---

## 13. Future Enhancements

Possible future improvements include:

- Online payment gateway.
- Real-time delivery tracking.
- Delivery partner application.
- Full product management and image upload.
- Coupon and discount system.
- Customer reviews and ratings.
- Push notifications.
- Email and SMS order notifications.
- Advanced sales reports.
- Multiple delivery addresses.
- Inventory alerts.
- Cloud storage for product images.
- Production-grade monitoring and backups.

---

## 14. Conclusion

QuickCart provides a complete basic workflow for an online grocery ordering system. It connects a customer-facing interface with a backend API and PostgreSQL database, while also providing an administrative interface for order monitoring.

The project demonstrates practical implementation of frontend development, REST APIs, authentication, database management, transaction-based order processing, deployment, and Android application packaging.

The current system is suitable as an MCA academic project and provides a foundation that can be extended into a larger grocery delivery platform.

---

## 15. Project Links

**Live Website:** https://quickcart-web.onrender.com

**GitHub Repository:** https://github.com/amanshrivastav8076/Repository-name-quickcart-grocery

**Production API:** https://quickcart-api-prod.onrender.com

---

**End of SRS – QuickCart**
