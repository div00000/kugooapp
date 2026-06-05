# 🔌 API Documentation - Kugoo Ecosystem

Complete REST API reference for the Kugoo food delivery platform.

---

## 📋 Base URL

**Development:** `http://localhost:5000/api/v1`
**Staging:** `https://staging-api.kugoo.app/api/v1`
**Production:** `https://api.kugoo.app/api/v1`

---

## 🔐 Authentication

All endpoints (except auth) require a valid JWT token in the `Authorization` header:

```bash
Authorization: Bearer <jwt_token>
```

### JWT Token Structure

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "accountType": "customer|merchant|rider|admin",
  "iat": 1623456789,
  "exp": 1623543189
}
```

---

## 📚 Core Endpoints

### Authentication

- `POST /auth/signup` - Sign up with email
- `POST /auth/signup-phone` - Sign up with phone
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/login` - Login with email/password
- `POST /auth/google` - Google login
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/logout` - Logout

### Users

- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `POST /users/upload-photo` - Upload profile photo
- `POST /users/addresses` - Add saved address
- `GET /users/addresses` - Get saved addresses

### Merchants

- `GET /merchants` - Get all merchants
- `GET /merchants/{id}` - Get merchant details
- `GET /merchants/{id}/menu` - Get merchant menu
- `POST /merchants/register` - Register as merchant
- `PUT /merchants/{id}` - Update merchant info

### Orders

- `POST /orders` - Create order
- `GET /orders/{id}` - Get order details
- `GET /orders` - Get order history
- `POST /orders/{id}/cancel` - Cancel order
- `PUT /orders/{id}/status` - Update order status

### Payments

- `POST /payments/initialize` - Initialize payment
- `GET /payments/{id}/verify` - Verify payment
- `GET /payments` - Get payment history

### Tracking

- `GET /tracking/{orderId}` - Get real-time tracking
- `WebSocket` - Real-time updates via Socket.IO

### Zaam AI

- `POST /ai/recommendations` - Get AI recommendations
- `POST /ai/chat` - Chat with Zaam

---

## 📊 Example Requests

### Sign Up
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{\n    "email": "user@example.com",\n    "password": "SecurePassword123!",\n    "firstName": "John",\n    "lastName": "Doe",\n    "accountType": "customer"\n  }'\n```

### Get Merchants
```bash\ncurl -X GET 'http://localhost:5000/api/v1/merchants?latitude=6.5244&longitude=3.3792&radius=5' \\\n  -H 'Authorization: Bearer YOUR_JWT_TOKEN'\n```\n\n### Create Order\n```bash\ncurl -X POST http://localhost:5000/api/v1/orders \\\n  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"merchantId\": \"merchant_id\",\n    \"items\": [{\"menuItemId\": \"item_id\", \"quantity\": 2}],\n    \"deliveryAddressId\": \"addr_id\",\n    \"paymentMethod\": \"card\"\n  }'\n```\n\n---\n\n## 🔧 Error Handling\n\nAll errors return this format:\n\n```json\n{\n  \"success\": false,\n  \"error\": {\n    \"code\": \"INVALID_REQUEST\",\n    \"message\": \"Invalid email format\"\n  }\n}\n```\n\n---\n\n## 📈 Rate Limiting\n\n- 100 requests per 15 minutes per user\n- 1000 requests per 15 minutes per IP\n\nHeaders: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`\n\n---\n\nFor detailed endpoint documentation, see the full API guide in Postman collection or Swagger UI at `/api-docs`.\n\n**Version:** v1 | **Status:** ✅ Production Ready\n