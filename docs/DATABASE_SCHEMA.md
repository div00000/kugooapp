# 🗄️ Database Schema - Kugoo Ecosystem

Complete PostgreSQL database design for the Kugoo food delivery platform.

---

## 📊 Entity Relationship Diagram

```
┌─────────────┐          ┌──────────────┐          ┌──────────────┐
│    Users    │          │  Merchants   │          │    Riders    │
├─────────────┤          ├──────────────┤          ├──────────────┤
│ id (PK)     │◄─────────│ id (PK)      │          │ id (PK)      │
│ email       │          │ user_id (FK) │          │ user_id (FK) │
│ phone       │          │ restaurant   │          │ vehicle_type │
│ password    │          │ rating       │          │ rating       │
│ created_at  │          │ verified     │          │ verified     │
└─────────────┘          └──────────────┘          └──────────────┘
       ▲                         │                          │
       │                         │                          │
       │              ┌──────────▼──────────┐               │
       │              │      Orders         │               │
       │              ├─────────────────────┤               │
       └──────────────│ customer_id (FK)    │───────────────┘
                      │ merchant_id (FK)    │
                      │ rider_id (FK)       │
                      │ status              │
                      │ total_amount        │
                      │ created_at          │
                      └─────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
        ┌───────▼────────┐  ┌──▼─────────┐  ┌▼──────────┐
        │  Order Items   │  │  Payments  │  │ Analytics│
        ├────────────────┤  ├────────────┤  ├───────────┤
        │ order_id (FK)  │  │ order_id   │  │ order_id  │
        │ menu_item_id   │  │ gateway    │  │ metrics   │
        │ quantity       │  │ status     │  │ values    │
        │ price          │  │ amount     │  │ created_at│
        └────────────────┘  └────────────┘  └───────────┘
```

---

## 📋 Core Tables

### 1. Users Table

**Purpose:** Store all platform users (customers, merchants, riders)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_photo_url TEXT,
  date_of_birth DATE,
  gender VARCHAR(20),
  verification_status VARCHAR(50) DEFAULT 'unverified',
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  account_status VARCHAR(50) DEFAULT 'active',
  account_type VARCHAR(50) NOT NULL, -- 'customer', 'merchant', 'rider', 'admin'
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_email_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_account_type ON users(account_type);
CREATE INDEX idx_users_created_at ON users(created_at);
```

---

### 2. Merchants Table

**Purpose:** Restaurant/vendor information

```sql
CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_name VARCHAR(255) NOT NULL,
  restaurant_slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  logo_url TEXT,
  category VARCHAR(100),
  cuisines TEXT[], -- Array of cuisine types
  
  -- Address Information
  address_street VARCHAR(255) NOT NULL,
  address_city VARCHAR(100) NOT NULL,
  address_state VARCHAR(100) NOT NULL,
  address_postal_code VARCHAR(20),
  address_country VARCHAR(100) DEFAULT 'Nigeria',
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  
  -- Business Information
  business_registration_number VARCHAR(100),
  tax_id VARCHAR(100),
  bank_account_number VARCHAR(50),
  bank_code VARCHAR(20),
  bank_name VARCHAR(100),
  
  -- Status & Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Ratings & Reviews
  average_rating DECIMAL(3, 2) DEFAULT 5.0,
  total_orders INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  
  -- Commission Configuration
  commission_rate DECIMAL(5, 2) DEFAULT 15.0, -- Percentage
  minimum_order_value DECIMAL(12, 2) DEFAULT 500.0,
  delivery_fee DECIMAL(12, 2) DEFAULT 1000.0,
  
  -- Operating Hours
  opening_time TIME NOT NULL DEFAULT '08:00:00',
  closing_time TIME NOT NULL DEFAULT '20:00:00',
  is_open BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT chk_commission_rate CHECK (commission_rate >= 0 AND commission_rate <= 100)
);

CREATE INDEX idx_merchants_user_id ON merchants(user_id);
CREATE INDEX idx_merchants_is_verified ON merchants(is_verified);
CREATE INDEX idx_merchants_category ON merchants(category);
CREATE INDEX idx_merchants_location ON merchants USING GIST (ll_to_earth(latitude, longitude));
CREATE INDEX idx_merchants_created_at ON merchants(created_at);
```

---

### 3. Menu Items Table

**Purpose:** Food items offered by merchants

```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  
  -- Pricing
  base_price DECIMAL(12, 2) NOT NULL,
  discount_price DECIMAL(12, 2),
  discount_percentage DECIMAL(5, 2),
  
  -- Availability
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Nutritional Info (Optional)
  calories INTEGER,
  protein_g DECIMAL(5, 2),
  fat_g DECIMAL(5, 2),
  carbs_g DECIMAL(5, 2),
  
  -- Dietary Info
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  
  -- Inventory
  quantity_in_stock INTEGER DEFAULT -1, -- -1 means unlimited
  
  -- Reviews
  average_rating DECIMAL(3, 2) DEFAULT 5.0,
  total_orders INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menu_items_merchant_id ON menu_items(merchant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_is_available ON menu_items(is_available);
CREATE INDEX idx_menu_items_created_at ON menu_items(created_at);
```

---

### 4. Riders Table

**Purpose:** Delivery personnel information

```sql
CREATE TABLE riders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  id_document_url TEXT,
  id_document_type VARCHAR(50),
  id_verified_at TIMESTAMP,
  
  -- Vehicle Information
  vehicle_type VARCHAR(50) NOT NULL, -- 'motorcycle', 'bicycle', 'car'
  vehicle_make VARCHAR(100),
  vehicle_model VARCHAR(100),
  vehicle_year INTEGER,
  vehicle_license_plate VARCHAR(20) UNIQUE NOT NULL,
  vehicle_registration_url TEXT,
  vehicle_insurance_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_available BOOLEAN DEFAULT FALSE,
  current_location_latitude DECIMAL(10, 8),
  current_location_longitude DECIMAL(11, 8),
  current_location_updated_at TIMESTAMP,
  
  -- Performance Metrics
  average_rating DECIMAL(3, 2) DEFAULT 5.0,
  total_deliveries INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  on_time_percentage DECIMAL(5, 2) DEFAULT 0,
  
  -- Earnings
  total_earnings DECIMAL(15, 2) DEFAULT 0,
  this_month_earnings DECIMAL(15, 2) DEFAULT 0,
  this_week_earnings DECIMAL(15, 2) DEFAULT 0,
  
  -- Bank Information
  bank_account_number VARCHAR(50),
  bank_code VARCHAR(20),
  bank_name VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_riders_user_id ON riders(user_id);
CREATE INDEX idx_riders_is_verified ON riders(is_verified);
CREATE INDEX idx_riders_is_available ON riders(is_available);
CREATE INDEX idx_riders_created_at ON riders(created_at);
```

---

### 5. Orders Table

**Purpose:** Customer orders

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL, -- KG-2026-000001
  
  -- Relationships
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE SET NULL,
  rider_id UUID REFERENCES riders(id) ON DELETE SET NULL,
  
  -- Order Status
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, confirmed, preparing, ready, picked_up, on_the_way, delivered, cancelled
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  
  -- Delivery Information
  delivery_address_street VARCHAR(255) NOT NULL,
  delivery_address_city VARCHAR(100) NOT NULL,
  delivery_address_state VARCHAR(100) NOT NULL,
  delivery_address_postal_code VARCHAR(20),
  delivery_address_country VARCHAR(100) DEFAULT 'Nigeria',
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  delivery_instructions TEXT,
  
  -- Pricing
  subtotal DECIMAL(12, 2) NOT NULL,
  delivery_fee DECIMAL(12, 2) NOT NULL,
  service_charge DECIMAL(12, 2) DEFAULT 0,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  promo_code_id UUID REFERENCES promo_codes(id),
  total_amount DECIMAL(12, 2) NOT NULL,
  
  -- Timestamps
  order_placed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  merchant_accepted_at TIMESTAMP,
  preparation_started_at TIMESTAMP,
  food_ready_at TIMESTAMP,
  rider_picked_at TIMESTAMP,
  delivery_started_at TIMESTAMP,
  delivered_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason VARCHAR(255),
  
  -- Estimated Times
  estimated_preparation_time INTEGER, -- minutes
  estimated_delivery_time INTEGER, -- minutes
  
  -- Customer Information
  customer_notes TEXT,
  customer_phone VARCHAR(20),
  customer_name VARCHAR(255),
  
  -- Merchant Acceptance
  merchant_accept_deadline TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_merchant_id ON orders(merchant_id);
CREATE INDEX idx_orders_rider_id ON orders(rider_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

---

### 6. Order Items Table

**Purpose:** Individual items in an order

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE SET NULL,
  
  -- Item Details
  item_name VARCHAR(255) NOT NULL,
  item_description TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  
  -- Customizations
  special_instructions TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);
```

---

### 7. Payments Table

**Purpose:** Payment transactions

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Payment Details
  gateway VARCHAR(50) NOT NULL, -- 'paystack', 'flutterwave', 'korapay'
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  reference_id VARCHAR(255),
  
  -- Amount
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  fee DECIMAL(12, 2) DEFAULT 0,
  
  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processing, successful, failed, cancelled
  
  -- Payment Method
  payment_method VARCHAR(50), -- 'card', 'wallet', 'bank_transfer'
  card_last_four VARCHAR(4),
  card_brand VARCHAR(50),
  
  -- Metadata
  metadata JSONB,
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_gateway ON payments(gateway);
```

---

### 8. Commissions Table

**Purpose:** Track commission splits

```sql
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Commission Recipients
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  rider_id UUID REFERENCES riders(id) ON DELETE SET NULL,
  
  -- Amounts
  order_total DECIMAL(12, 2) NOT NULL,
  merchant_amount DECIMAL(12, 2) NOT NULL,
  rider_amount DECIMAL(12, 2) NOT NULL,
  platform_amount DECIMAL(12, 2) NOT NULL,
  
  -- Rates Used
  merchant_rate DECIMAL(5, 2),
  rider_rate DECIMAL(5, 2),
  platform_rate DECIMAL(5, 2),
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, processing
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_commissions_order_id ON commissions(order_id);
CREATE INDEX idx_commissions_merchant_id ON commissions(merchant_id);
CREATE INDEX idx_commissions_rider_id ON commissions(rider_id);
CREATE INDEX idx_commissions_status ON commissions(status);
```

---

### 9. Reviews & Ratings Table

**Purpose:** Customer reviews for merchants and riders

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Review Type
  review_type VARCHAR(50) NOT NULL, -- 'merchant', 'rider', 'delivery'
  target_id UUID NOT NULL, -- merchant_id or rider_id
  
  -- Rating & Comment
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  -- Service Aspects (for riders)
  punctuality_rating INTEGER CHECK (punctuality_rating IS NULL OR (punctuality_rating >= 1 AND punctuality_rating <= 5)),
  hygiene_rating INTEGER CHECK (hygiene_rating IS NULL OR (hygiene_rating >= 1 AND hygiene_rating <= 5)),
  service_rating INTEGER CHECK (service_rating IS NULL OR (service_rating >= 1 AND service_rating <= 5)),
  
  is_verified_purchase BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_target_id ON reviews(target_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

---

### 10. Notifications Table

**Purpose:** User notifications

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification Details
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL, -- order_placed, order_accepted, food_ready, etc.
  
  -- Related Entity
  related_order_id UUID REFERENCES orders(id),
  related_merchant_id UUID REFERENCES merchants(id),
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Delivery Channels
  sent_via_push BOOLEAN DEFAULT FALSE,
  sent_via_email BOOLEAN DEFAULT FALSE,
  sent_via_sms BOOLEAN DEFAULT FALSE,
  sent_via_whatsapp BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

---

### 11. Promo Codes Table

**Purpose:** Discount codes

```sql
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  
  -- Discount Type
  discount_type VARCHAR(50) NOT NULL, -- 'percentage', 'fixed_amount'
  discount_value DECIMAL(12, 2) NOT NULL,
  max_discount DECIMAL(12, 2), -- For percentage discounts
  
  -- Conditions
  minimum_order_value DECIMAL(12, 2),
  max_uses INTEGER,
  max_uses_per_user INTEGER DEFAULT 1,
  
  -- Validity
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Usage Tracking
  total_uses INTEGER DEFAULT 0,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_is_active ON promo_codes(is_active);
```

---

### 12. Analytics Table

**Purpose:** Track metrics and analytics

```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Entity Being Tracked
  entity_type VARCHAR(50) NOT NULL, -- 'merchant', 'rider', 'order', 'platform'
  entity_id UUID,
  
  -- Metric
  metric_type VARCHAR(100) NOT NULL, -- 'total_orders', 'total_revenue', etc.
  metric_value DECIMAL(15, 2),
  
  -- Time Period
  period_date DATE NOT NULL,
  period_type VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly'
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_entity_type ON analytics(entity_type);
CREATE INDEX idx_analytics_entity_id ON analytics(entity_id);
CREATE INDEX idx_analytics_period_date ON analytics(period_date);
```

---

## 🔑 Key Relationships

| From | To | Relationship |
|------|----|--------------|
| Users | Merchants | 1-1 (User becomes Merchant) |
| Users | Riders | 1-1 (User becomes Rider) |
| Merchants | MenuItems | 1-Many |
| Orders | Users | Many-1 (Customer) |
| Orders | Merchants | Many-1 |
| Orders | Riders | Many-1 |
| Orders | Payments | 1-1 |
| Orders | OrderItems | 1-Many |
| OrderItems | MenuItems | Many-1 |
| Reviews | Orders | Many-1 |
| Notifications | Users | Many-1 |

---

## 🗂️ Database Design Principles

1. **Normalization:** 3NF to minimize redundancy
2. **Indexing:** Strategic indexes for query performance
3. **Constraints:** Data integrity through constraints
4. **Timestamps:** All tables have created_at and updated_at
5. **Soft Deletes:** Using is_active flag instead of hard deletes
6. **UUIDs:** Using UUID for primary keys (scalability)
7. **Foreign Keys:** Referential integrity enforcement

---

## 📈 Scaling Considerations

- **Partitioning:** Orders table by date (by month)
- **Archival:** Move old analytics data to archive tables
- **Read Replicas:** For analytics queries
- **Connection Pooling:** Use PgBouncer
- **Caching:** Redis for frequently accessed data

---

**Database Version:** PostgreSQL 14+
**Last Updated:** June 2026
