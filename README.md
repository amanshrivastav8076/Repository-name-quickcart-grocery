# QuickCart Grocery Store

A full-stack grocery shopping experience built with React, Vite and Express.

## Live
Frontend: https://quickcart-web.onrender.com
API: https://quickcart-api-prod.onrender.com

## Features
- 30 grocery products across 6 categories
- Search and price sorting
- Wishlist and product quick view
- Registration/login and JWT auth
- Cart quantity controls and delivery threshold
- Checkout with address validation
- Cash on Delivery checkout
- Optional Fast2SMS order-confirmation SMS
- Order history
- Admin dashboard with sales/customer/order stats
- Admin order-status updates
- Responsive mobile-friendly UI

## Demo admin
Email: admin@quickcart.local
Password: QuickCart@123

## Local development
Backend:
`cd backend && npm install && npm start`

Frontend:
`cd frontend && npm install && npm run dev`

Set `VITE_API_URL` to the API URL for a deployed frontend.

## Notifications
The backend includes an optional Fast2SMS order-confirmation hook. Add `FAST2SMS_API_KEY` to the Render API service to enable SMS; without it, checkout still succeeds and the site shows the order details on-screen.

## Production note
The API is designed for PostgreSQL persistence with an automatic in-memory fallback if the database is unavailable. The current Render database connection still needs its internal connection reference corrected before persistence is fully active. COD checkout is live; online payments require merchant credentials.
