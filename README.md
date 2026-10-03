# QuickCart Grocery Store

A full-stack grocery shopping experience built with React, Vite and Express.

## Live
Frontend: https://quickcart-web.onrender.com
API: https://quickcart-api-hcuh.onrender.com

## Features
- 30 grocery products across 6 categories
- Search and price sorting
- Wishlist and product quick view
- Registration/login and JWT auth
- Cart quantity controls and delivery threshold
- Checkout with address validation
- Cash on Delivery demo flow
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

## Production note
The current API uses in-memory users, carts, orders and stock. The live demo is functional, but free-service restarts can reset runtime data. PostgreSQL persistence and real payment credentials are the next production upgrade.
