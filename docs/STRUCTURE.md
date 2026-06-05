# 🗂️ Directory Structure Guide

Complete guide to the Kugoo repository structure with descriptions of each component.

---

## 📁 Root Directory

```
kugooapp/
├── 📱 apps/                           # Client applications
├── 🖥️  backend/                       # Backend API server
├── 📚 docs/                           # Documentation
├── 🔧 docker/                         # Docker configuration
├── 🧪 tests/                          # Test files
├── 🎨 design/                         # Design assets
├── .github/                           # GitHub workflows
├── .gitignore                         # Git ignore rules
├── .eslintrc.json                     # ESLint configuration
├── .prettierrc                        # Prettier configuration
├── package.json                       # Root dependencies
└── README.md                          # Main documentation
```

---

## 📱 Apps Directory (`apps/`)

### Customer App
```
apps/customer-app/
├── src/
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── SignUpScreen.tsx       # Email/phone signup
│   │   │   ├── LoginScreen.tsx        # Login screen
│   │   │   ├── OTPScreen.tsx          # OTP verification
│   │   │   └── SocialAuthScreen.tsx   # Google/Apple login
│   │   │
│   │   ├── Home/
│   │   │   ├── HomeScreen.tsx         # Main feed
│   │   │   ├── RestaurantListScreen.tsx
│   │   │   ├── RestaurantDetailScreen.tsx
│   │   │   ├── SearchScreen.tsx       # Food search
│   │   │   └── CategoriesScreen.tsx   # Food categories
│   │   │
│   │   ├── Orders/
│   │   │   ├── CartScreen.tsx         # Shopping cart
│   │   │   ├── CheckoutScreen.tsx     # Checkout flow
│   │   │   ├── OrderConfirmationScreen.tsx
│   │   │   ├── ActiveOrdersScreen.tsx
│   │   │   ├── OrderTrackingScreen.tsx # Real-time tracking
│   │   │   ├── OrderHistoryScreen.tsx
│   │   │   └── RateOrderScreen.tsx    # Rating screen
│   │   │
│   │   ├── Profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── EditProfileScreen.tsx
│   │   │   ├── AddressesScreen.tsx
│   │   │   ├── PaymentMethodsScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   └── HelpScreen.tsx
│   │   │
│   │   └── AI/
│   │       ├── ZaamScreen.tsx         # Zaam AI interface
│   │       ├── RecommendationsScreen.tsx
│   │       └── ChatScreen.tsx
│   │
│   ├── components/
│   │   ├── Common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── Empty.tsx
│   │   │   └── Error.tsx
│   │   │
│   │   ├── Restaurant/
│   │   │   ├── RestaurantCard.tsx
│   │   │   ├── RestaurantHeader.tsx
│   │   │   ├── MenuCategory.tsx
│   │   │   └── MenuItemCard.tsx
│   │   │
│   │   ├── Order/
│   │   │   ├── CartItem.tsx
│   │   │   ├── OrderSummary.tsx
│   │   │   ├── TrackingMap.tsx
│   │   │   ├── RiderInfo.tsx
│   │   │   └── ETA.tsx
│   │   │
│   │   └── AI/
│   │       ├── ZaamFloating.tsx       # Floating AI button
│   │       ├── ZaamChat.tsx
│   │       └── RecommendationCard.tsx
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── AppNavigator.tsx
│   │   ├── BottomTabNavigator.tsx
│   │   └── linking.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                 # Auth context
│   │   ├── useOrders.ts               # Order management
│   │   ├── useUser.ts                 # User data
│   │   ├── useLocation.ts             # GPS location
│   │   └── useTracking.ts             # Order tracking
│   │
│   ├── services/
│   │   ├── api.ts                     # API client
│   │   ├── authService.ts
│   │   ├── orderService.ts
│   │   ├── trackingService.ts
│   │   ├── userService.ts
│   │   ├── aiService.ts
│   │   └── socketService.ts
│   │
│   ├── store/
│   │   ├── reducers/
│   │   │   ├── authSlice.ts
│   │   │   ├── orderSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── helpers.ts
│   │   └── constants.ts
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── lottie/
│   │
│   ├── styles/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── order.ts
│   │   └── merchant.ts
│   │
│   ├── App.tsx                        # Root component
│   └── env.ts                         # Environment config
│
├── app.json                           # Expo configuration
├── .env.example
├── package.json
└── tsconfig.json
```

### Rider App
```
apps/rider-app/
├── src/
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── SignUpScreen.tsx
│   │   │   ├── VerificationScreen.tsx
│   │   │   ├── DocumentVerificationScreen.tsx
│   │   │   └── VehicleRegistrationScreen.tsx
│   │   │
│   │   ├── Home/
│   │   │   ├── HomeScreen.tsx         # Available deliveries
│   │   │   ├── DeliveryRequestScreen.tsx
│   │   │   ├── NavigationScreen.tsx   # GPS navigation
│   │   │   └── PickupScreen.tsx       # Confirm pickup
│   │   │
│   │   ├── Active/
│   │   │   ├── ActiveDeliveriesScreen.tsx
│   │   │   ├── DeliveryDetailsScreen.tsx
│   │   │   ├── RouteScreen.tsx
│   │   │   └── DeliveryCompletionScreen.tsx
│   │   │
│   │   └── Earnings/
│   │       ├── EarningsScreen.tsx
│   │       ├── StatsScreen.tsx
│   │       ├── WithdrawalScreen.tsx
│   │       └── TransactionHistoryScreen.tsx
│   │
│   ├── components/
│   │   ├── Map/
│   │   │   ├── DeliveryMap.tsx
│   │   │   ├── RoutePolyline.tsx
│   │   │   └── MarkerClusterer.tsx
│   │   │
│   │   ├── Delivery/
│   │   │   ├── DeliveryCard.tsx
│   │   │   ├── CustomerInfo.tsx
│   │   │   ├── PaymentSummary.tsx
│   │   │   └── ProofOfDelivery.tsx
│   │   │
│   │   └── Earnings/
│   │       ├── EarningsCard.tsx
│   │       ├── StatCard.tsx
│   │       └── Chart.tsx
│   │
│   ├── hooks/
│   │   ├── useLocation.ts             # GPS tracking
│   │   ├── useDeliveries.ts
│   │   ├── useEarnings.ts
│   │   └── useNavigation.ts
│   │
│   ├── services/
│   │   ├── riderService.ts
│   │   ├── locationService.ts
│   │   ├── navigationService.ts
│   │   └── earningsService.ts
│   │
│   └── [similar structure to customer-app]
│
└── [configuration files]
```

### Merchant Portal
```
apps/merchant-portal/
├── src/
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignUpPage.tsx
│   │   │   └── VerificationPage.tsx
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── OverviewPage.tsx       # Sales overview
│   │   │   ├── OrdersPage.tsx         # Manage orders
│   │   │   ├── MenuPage.tsx           # Manage menu
│   │   │   ├── AnalyticsPage.tsx      # Sales analytics
│   │   │   └── SettingsPage.tsx
│   │   │
│   │   └── Menu/
│   │       ├── MenuListPage.tsx
│   │       ├── AddItemPage.tsx
│   │       ├── EditItemPage.tsx
│   │       ├── BulkUploadPage.tsx
│   │       └── CategoriesPage.tsx
│   │
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── Layout.tsx
│   │   ├── Orders/
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderDetail.tsx
│   │   │   ├── OrderActions.tsx
│   │   │   └── OrderTimer.tsx
│   │   │
│   │   ├── Menu/
│   │   │   ├── MenuForm.tsx
│   │   │   ├── ItemCard.tsx
│   │   │   ├── CategorySelect.tsx
│   │   │   └── ImageUpload.tsx
│   │   │
│   │   ├── Analytics/
│   │   │   ├── Charts.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── DateRangePicker.tsx\n│   │   │   └── ExportButton.tsx
│   │   │
│   │   └── Common/\n│   │       └── [Shared components]\n│   │\n│   ├── hooks/\n│   │   ├── useMerchant.ts\n│   │   ├── useOrders.ts\n│   │   ├── useMenu.ts\n│   │   └── useAnalytics.ts\n│   │\n│   ├── services/\n│   │   ├── merchantService.ts\n│   │   ├── orderService.ts\n│   │   ├── menuService.ts\n│   │   ├── analyticsService.ts\n│   │   └── fileUploadService.ts\n│   │\n│   ├── store/\n│   │   ├── merchantSlice.ts\n│   │   ├── orderSlice.ts\n│   │   └── menuSlice.ts\n│   │\n│   ├── utils/\n│   │   ├── formatters.ts\n│   │   ├── validators.ts\n│   │   └── constants.ts\n│   │\n│   ├── types/\n│   │   ├── merchant.ts\n│   │   ├── order.ts\n│   │   └── menu.ts\n│   │\n│   ├── styles/\n│   │   ├── theme.ts\n│   │   └── global.css\n│   │\n│   ├── App.tsx\n│   └── main.tsx\n│\n├── vite.config.ts\n├── package.json\n└── tsconfig.json\n```\n\n### Admin Dashboard\n```\napps/admin-dashboard/\n├── src/\n│   ├── pages/\n│   │   ├── Dashboard/\n│   │   │   ├── OverviewPage.tsx      # Platform stats\n│   │   │   ├── RevenueChart.tsx\n│   │   │   └── MetricsCard.tsx\n│   │   │\n│   │   ├── Users/\n│   │   │   ├── UsersPage.tsx\n│   │   │   ├── UserDetailPage.tsx\n│   │   │   └── ManageAccessPage.tsx\n│   │   │\n│   │   ├── Merchants/\n│   │   │   ├── MerchantsPage.tsx\n│   │   │   ├── MerchantVerification.tsx\n│   │   │   ├── CommissionSettings.tsx\n│   │   │   └── PerformanceMetrics.tsx\n│   │   │\n│   │   ├── Riders/\n│   │   │   ├── RidersPage.tsx\n│   │   │   ├── RiderVerification.tsx\n│   │   │   ├── DocumentReview.tsx\n│   │   │   └── DisputeResolution.tsx\n│   │   │\n│   │   ├── Orders/\n│   │   │   ├── OrdersPage.tsx\n│   │   │   ├── OrderDetailPage.tsx\n│   │   │   ├── DisputeResolutionPage.tsx\n│   │   │   └── RefundManagement.tsx\n│   │   │\n│   │   ├── Payments/\n│   │   │   ├── PaymentsPage.tsx\n│   │   │   ├── TransactionDetail.tsx\n│   │   │   ├── FraudDetection.tsx\n│   │   │   └── ReconciliationPage.tsx\n│   │   │\n│   │   ├── Analytics/\n│   │   │   ├── AnalyticsPage.tsx\n│   │   │   ├── ReportsPage.tsx\n│   │   │   ├── ExportPage.tsx\n│   │   │   └── CustomReports.tsx\n│   │   │\n│   │   ├── Content/\n│   │   │   ├── PromosPage.tsx\n│   │   │   ├── BannersPage.tsx\n│   │   │   ├── CategoriesPage.tsx\n│   │   │   └── ContentModerationPage.tsx\n│   │   │\n│   │   └── Settings/\n│   │       ├── CommissionSettings.tsx\n│   │       ├── FeatureFlags.tsx\n│   │       ├── SystemSettings.tsx\n│   │       └── AuditLogs.tsx\n│   │\n│   ├── components/\n│   │   ├── Sidebar.tsx\n│   │   ├── Topbar.tsx\n│   │   ├── DataTable.tsx\n│   │   ├── Charts/\n│   │   ├── Forms/\n│   │   ├── Modals/\n│   │   └── [Other components]\n│   │\n│   ├── hooks/\n│   │   ├── useAdmin.ts\n│   │   ├── useUsers.ts\n│   │   ├── useAnalytics.ts\n│   │   └── useOrders.ts\n│   │\n│   ├── services/\n│   │   ├── adminService.ts\n│   │   ├── userService.ts\n│   │   ├── analyticsService.ts\n│   │   ├── reportService.ts\n│   │   └── auditService.ts\n│   │\n│   ├── store/\n│   │   ├── adminSlice.ts\n│   │   ├── filtersSlice.ts\n│   │   └── uiSlice.ts\n│   │\n│   └── [Similar structure to merchant portal]\n│\n└── [Configuration files]\n```\n\n### Marketing Website\n```\napps/marketing-website/\n├── src/\n│   ├── pages/\n│   │   ├── Index.tsx                 # Home page\n│   │   ├── Features.tsx              # Features showcase\n│   │   ├── Pricing.tsx               # Pricing page\n│   │   ├── About.tsx                 # About page\n│   │   ├── Blog.tsx                  # Blog listing\n│   │   ├── Contact.tsx               # Contact page\n│   │   └── Privacy.tsx               # Privacy policy\n│   │\n│   ├── components/\n│   │   ├── Navigation/\n│   │   │   ├── Header.tsx\n│   │   │   ├── Footer.tsx\n│   │   │   └── MobileMenu.tsx\n│   │   │\n│   │   ├── Sections/\n│   │   │   ├── Hero.tsx              # Hero section with 3D\n│   │   │   ├── Features.tsx\n│   │   │   ├── HowItWorks.tsx\n│   │   │   ├── Testimonials.tsx\n│   │   │   ├── CTA.tsx               # Call-to-action\n│   │   │   └── Newsletter.tsx\n│   │   │\n│   │   └── 3D/\n│   │       ├── Scene.tsx             # Main 3D scene\n│   │       ├── City.tsx              # 3D city environment\n│   │       ├── Rider.tsx             # 3D rider model\n│   │       ├── Food.tsx              # 3D food model\n│   │       └── Animations.tsx\n│   │\n│   ├── hooks/\n│   │   ├── useScroll.ts\n│   │   ├── useInView.ts\n│   │   └── use3D.ts\n│   │\n│   ├── utils/\n│   │   ├── analytics.ts\n│   │   ├── scroll.ts\n│   │   └── animation.ts\n│   │\n│   ├── styles/\n│   │   ├── globals.css\n│   │   ├── animations.css\n│   │   └── theme.css\n│   │\n│   ├── public/\n│   │   ├── models/                   # 3D models\n│   │   ├── images/\n│   │   ├── videos/\n│   │   └── icons/\n│   │\n│   ├── App.tsx\n│   └── main.tsx\n│\n├── vite.config.ts\n├── package.json\n└── tsconfig.json\n```\n\n---\n\n## 🖥️ Backend Directory (`backend/`)\n\n```\nbackend/\n├── src/\n│   ├── config/                       # Configuration files\n│   │   ├── database.ts               # PostgreSQL setup\n│   │   ├── redis.ts                  # Redis setup\n│   │   ├── firebase.ts               # Firebase config\n│   │   ├── payment.ts                # Payment providers\n│   │   ├── email.ts                  # SendGrid config\n│   │   ├── sms.ts                    # Twilio config\n│   │   ├── whatsapp.ts               # WhatsApp Business API\n│   │   ├── ai.ts                     # OpenAI config\n│   │   ├── storage.ts                # S3/Supabase config\n│   │   ├── maps.ts                   # Google Maps config\n│   │   └── sentry.ts                 # Error tracking\n│   │\n│   ├── middleware/                   # Express middleware\n│   │   ├── auth.ts                   # JWT verification\n│   │   ├── validation.ts             # Request validation\n│   │   ├── errorHandler.ts           # Global error handler\n│   │   ├── rateLimit.ts              # Rate limiting\n│   │   ├── cors.ts                   # CORS configuration\n│   │   ├── logger.ts                 # Request logging\n│   │   ├── security.ts               # Security headers\n│   │   └── requestContext.ts         # Request context\n│   │\n│   ├── routes/                       # API routes\n│   │   ├── auth.routes.ts            # /auth endpoints\n│   │   ├── users.routes.ts           # /users endpoints\n│   │   ├── merchants.routes.ts       # /merchants endpoints\n│   │   ├── riders.routes.ts          # /riders endpoints\n│   │   ├── orders.routes.ts          # /orders endpoints\n│   │   ├── payments.routes.ts        # /payments endpoints\n│   │   ├── tracking.routes.ts        # /tracking endpoints\n│   │   ├── analytics.routes.ts       # /analytics endpoints\n│   │   ├── admin.routes.ts           # /admin endpoints\n│   │   ├── ai.routes.ts              # /ai endpoints\n│   │   ├── notifications.routes.ts   # /notifications endpoints\n│   │   ├── health.routes.ts          # /health endpoint\n│   │   ├── webhooks.routes.ts        # /webhooks endpoints\n│   │   └── index.ts                  # Route aggregator\n│   │\n│   ├── controllers/                  # Route handlers\n│   │   ├── authController.ts\n│   │   ├── userController.ts\n│   │   ├── merchantController.ts\n│   │   ├── riderController.ts\n│   │   ├── orderController.ts\n│   │   ├── paymentController.ts\n│   │   ├── trackingController.ts\n│   │   ├── analyticsController.ts\n│   │   ├── adminController.ts\n│   │   ├── aiController.ts\n│   │   ├── notificationController.ts\n│   │   ├── webhookController.ts\n│   │   └── healthController.ts\n│   │\n│   ├── services/                     # Business logic\n│   │   ├── authService.ts            # Auth logic\n│   │   ├── userService.ts\n│   │   ├── merchantService.ts\n│   │   ├── riderService.ts\n│   │   ├── orderService.ts           # Order management\n│   │   ├── paymentService.ts         # Payment processing\n│   │   ├── trackingService.ts        # Real-time tracking\n│   │   ├── analyticsService.ts       # Analytics\n│   │   ├── commissionService.ts      # Commission engine\n│   │   ├── aiService.ts              # Zaam AI\n│   │   ├── notificationService.ts    # Notifications\n│   │   ├── emailService.ts           # Email sending\n│   │   ├── smsService.ts             # SMS sending\n│   │   ├── whatsappService.ts        # WhatsApp messaging\n│   │   ├── fileUploadService.ts      # File uploads\n│   │   ├── riderAssignmentService.ts # Rider matching\n│   │   └── reportService.ts          # Report generation\n│   │\n│   ├── models/                       # Database entities\n│   │   ├── User.model.ts\n│   │   ├── Merchant.model.ts\n│   │   ├── Rider.model.ts\n│   │   ├── Order.model.ts\n│   │   ├── OrderItem.model.ts\n│   │   ├── Payment.model.ts\n│   │   ├── MenuItem.model.ts\n│   │   ├── Review.model.ts\n│   │   ├── Commission.model.ts\n│   │   ├── Analytics.model.ts\n│   │   ├── Notification.model.ts\n│   │   ├── PromoCode.model.ts\n│   │   └── Tracking.model.ts\n│   │\n│   ├── utils/                        # Utility functions\n│   │   ├── validators.ts             # Input validation\n│   │   ├── formatters.ts             # Data formatting\n│   │   ├── encryption.ts             # Encryption/hashing\n│   │   ├── jwt.ts                    # JWT utilities\n│   │   ├── tracking.ts               # Tracking logic\n│   │   ├── riderAssignment.ts        # Rider matching algorithm\n│   │   ├── commissionCalculator.ts   # Commission math\n│   │   ├── distanceCalculator.ts     # Distance calculation\n│   │   ├── logger.ts                 # Logging utilities\n│   │   └── errorUtils.ts             # Error handling\n│   │\n│   ├── websocket/                    # Real-time features\n│   │   ├── socket.ts                 # Socket.IO setup\n│   │   ├── events.ts                 # Event definitions\n│   │   ├── handlers.ts               # Event handlers\n│   │   ├── namespaces/\n│   │   │   ├── tracking.namespace.ts\n│   │   │   ├── orders.namespace.ts\n│   │   │   └── notifications.namespace.ts\n│   │   └── middlewares.ts            # Socket middleware\n│   │\n│   ├── database/                     # Database\n│   │   ├── migrations/               # SQL migrations\n│   │   │   ├── 001_initial_schema.sql\n│   │   │   ├── 002_add_indices.sql\n│   │   │   └── [...more migrations]\n│   │   │\n│   │   ├── seeds/                    # Seed data\n│   │   │   ├── seedUsers.ts\n│   │   │   ├── seedMerchants.ts\n│   │   │   ├── seedMenuItems.ts\n│   │   │   └── seed.ts\n│   │   │\n│   │   ├── schema.sql                # Full schema\n│   │   └── migrations.ts             # Migration runner\n│   │\n│   ├── types/                        # TypeScript types\n│   │   ├── index.ts\n│   │   ├── express.d.ts              # Express extensions\n│   │   ├── auth.types.ts\n│   │   ├── user.types.ts\n│   │   ├── order.types.ts\n│   │   ├── payment.types.ts\n│   │   ├── merchant.types.ts\n│   │   ├── rider.types.ts\n│   │   ├── api.types.ts              # API response types\n│   │   └── socket.types.ts\n│   │\n│   ├── constants/                    # Constants\n│   │   ├── errors.ts                 # Error codes/messages\n│   │   ├── messages.ts               # Response messages\n│   │   ├── status.ts                 # Status constants\n│   │   ├── commissions.ts            # Commission rates\n│   │   ├── validation.ts             # Validation rules\n│   │   └── features.ts               # Feature flags\n│   │\n│   ├── app.ts                        # Express app setup\n│   ├── server.ts                     # Server entry point\n│   └── index.ts                      # Export index\n│\n├── .env.example                      # Environment template\n├── .env.development                  # Dev environment\n├── .env.staging                      # Staging environment\n├── .env.production                   # Prod environment\n├── package.json\n├── tsconfig.json\n├── eslintrc.json\n└── README.md\n```\n\n---\n\n## 📚 Docs Directory (`docs/`)\n\n```\ndocs/\n├── README.md                         # Documentation index\n├── QUICK_START.md                    # 5-minute setup\n├── API.md                            # REST API reference\n├── DATABASE_SCHEMA.md                # Database design\n├── ENVIRONMENT_SETUP.md              # API keys guide\n├── AUTHENTICATION.md                 # Auth flow\n├── PAYMENT_FLOW.md                   # Payment integration\n├── TRACKING_SYSTEM.md                # Real-time tracking\n├── COMMISSION_ENGINE.md              # Commission engine\n├── WHATSAPP_BOT.md                   # WhatsApp integration\n├── AI_ASSISTANT.md                   # Zaam AI setup\n├── DEPLOYMENT.md                     # Production deployment\n├── ARCHITECTURE.md                   # System architecture\n├── PROJECT_OVERVIEW.md               # Project overview\n├── STRUCTURE.md                      # This file\n├── CONTRIBUTING.md                   # Contribution guide\n└── TROUBLESHOOTING.md                # Common issues\n```\n\n---\n\n## 📊 Summary\n\n| Directory | Purpose | Components |\n|-----------|---------|------------|\n| `apps/` | Client applications | 4 apps (Customer, Rider, Merchant, Admin) + Website |\n| `backend/` | API server | 10+ services, models, routes, middleware |\n| `docs/` | Documentation | 15+ guides and references |\n| `docker/` | Containerization | Docker configs, Compose files |\n| `tests/` | Testing | Unit, integration, E2E tests |\n| `.github/` | CI/CD | GitHub Actions workflows |\n\n---\n\n**For more details, see specific component documentation in `/docs` folder.**\n\n**Last Updated:** June 2026\n