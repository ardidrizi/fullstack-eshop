# E-Shop

A modern, responsive e-commerce web application where users can browse products, shop by categories, view featured items, and navigate easily with a streamlined UI.

## Features
- **Homepage**: Hero section, featured products, and category browsing.
- **Product Categories**: Dynamic product categorization for easy navigation.
- **Product Listing**: View product details, add to cart.
- **Responsive Design**: Fully responsive for desktop and mobile users.
- **Footer**: Includes social media links with modern styling and hover effects.

## Technologies
- **Frontend**: React, CSS, FontAwesome (for icons)
- **Backend**: Node.js, Express, MongoDB (REST API for products)
- **Styling**: Modern, mobile-responsive CSS with flexbox and grid layouts

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/e-shop.git
   cd e-shop
   ```

2. Install dependencies:
   ```bash
   cd server
   npm install
   cd ..\client
   npm install
   ```

3. Configure environment variables:
   - `server\.env`:
     ```bash
     MONGO_URL=your_mongodb_connection_string
     PORT=3000
     ```
   - `client\.env`:
     ```bash
     VITE_SERVER_URL=http://localhost:3000/api/products
     VITE_API_URL=http://localhost:3000/api
     ```

4. Run the server:
   ```bash
   cd server
   npm run dev
   ```

5. Run the client:
   ```bash
   cd ..\client
   npm run dev
   ```

## Notes
- The API is served at `http://localhost:3000/api/products`.
- Update `VITE_SERVER_URL` if your server runs on a different host or port.
- Admin seed login: `admin@eshop.dev` / `Admin123!`
- Run `npm run seed` in `server` to create demo data.
