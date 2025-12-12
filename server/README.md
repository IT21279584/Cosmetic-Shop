# Cosmetic Shop Backend API

Production-ready REST API for a modern cosmetic e-commerce platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- ✅ User authentication & authorization (JWT)
- ✅ Product management with image uploads
- ✅ Shopping cart functionality
- ✅ Order processing & tracking
- ✅ Product reviews & ratings
- ✅ Wishlist management
- ✅ Payment integration (Stripe)
- ✅ Email notifications
- ✅ Admin dashboard
- ✅ Inventory management
- ✅ Advanced filtering & search
- ✅ Rate limiting & security

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Cloudinary account (for image uploads)
- Stripe account (for payments)
- Gmail account (for emails)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual credentials.

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

5. **Run the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `PUT /api/auth/update-password` - Update password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:slugOrId` - Get single product
- `GET /api/products/best-sellers` - Get best sellers
- `GET /api/products/:id/related` - Get related products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Reviews
- `GET /api/reviews/products/:productId` - Get product reviews
- `POST /api/reviews/products/:productId` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/:productId` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist
- `DELETE /api/wishlist` - Clear wishlist

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/addresses` - Add address
- `PUT /api/users/addresses/:addressId` - Update address
- `DELETE /api/users/addresses/:addressId` - Delete address

### Payment
- `POST /api/payment/create-payment-intent` - Create payment intent
- `POST /api/payment/webhook` - Stripe webhook

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users

## 🔒 Security Features

- Helmet.js for HTTP headers security
- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS configuration
- XSS protection

## 📧 Email Templates

The API includes beautiful email templates for:
- Welcome emails
- Order confirmations
- Order status updates
- Password reset

## 🎯 Next Steps

After setting up the backend, you can:
1. Test endpoints using Postman or Thunder Client
2. Create seed data for testing
3. Set up the frontend React application
4. Configure deployment (Heroku, AWS, DigitalOcean, etc.)

## 📝 Notes

- All routes starting with `/api` are rate limited
- Authentication routes have stricter rate limits
- File uploads are limited to 5MB per image
- Products support up to 4 images
- All dates are in UTC

## 🤝 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for modern e-commerce**