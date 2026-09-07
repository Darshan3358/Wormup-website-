# Womup — Role Management & Operations SRS
**Software Requirements Specification: Multi-Role Quick-Commerce Operations**

---

## Operational Roles Overview

* **Admin**: Manages the entire business, catalog, dark store network, dynamic area-wise pricing, user management, and overall system policies.
* **Picker (Store Staff)**: Manages real-time order picking, weight verification, quality check, substitutions, and packing inside the assigned dark store.
* **Rider (Delivery Partner)**: Manages store pickup, real-time GPS transit, delivery OTP verification, and last-mile fulfillment within the 10–12 minute delivery window.
* **Customer**: Browses farm-fresh vegetables, selects delivery location (determining area pricing & serviceability), chooses weight variants, places orders, and tracks delivery live.

```text
                    ADMIN
                      │
       ┌──────────────┼──────────────┐
       │              │              │
       ▼              ▼              ▼
     STORE         PICKERS          RIDERS
       │              │              │
       └───────┬──────┘              │
               ▼                     │
            ORDERS                   │
               │                     │
               ▼                     │
            PICKING                  │
               │                     │
               ▼                     │
            PACKING                  │
               │                     │
               ▼                     │
        READY FOR PICKUP ────────────┘
                                     │
                                     ▼
                                  DELIVERY
                                     │
                                     ▼
                                  CUSTOMER
```

---

## 1. User Management

The **User Management module** allows the Womup admin to manage all registered customers and their account activity.

### 1.1 Customer Registration

Customer can register using:
* Mobile number
* OTP verification
* Name
* Email address (optional)
* Default delivery address

**Flow:**
```text
Customer
   ↓
Enter Mobile Number
   ↓
Send OTP
   ↓
Verify OTP
   ↓
Create Account
   ↓
Select Location
   ↓
Add Address
   ↓
Account Active
```

### 1.2 Admin User List

Admin can view:
```text
User ID
Name
Mobile
Email
Area
Total Orders
Total Spent
Account Status
Registered Date
Last Login
```

Example:

| User | Area | Orders | Spent | Status |
| :--- | :--- | -----: | ----: | :--- |
| Rahul Patel | Bopal | 18 | ₹8,420 | Active |
| Ayushi Shah | Satellite | 12 | ₹5,280 | Active |
| Darshan Mehta | Vastrapur | 2 | ₹780 | Blocked |

### 1.3 Admin Actions on Users

**View User:**
* Personal Information
* Addresses
* Order History
* Payments
* Refunds
* Coupons Used
* Reviews
* Account Activity

**Edit User:**
* Name
* Email
* Phone (subject to verification)
* Account status
* Default address

**Block / Unblock User:**
```text
Active  ──[Block]──►  User cannot place new orders
Blocked ──[Unblock]──►  Account Active
```

### 1.4 User Address Management

Admin can see all customer addresses (`Home`, `Office`, `Other`). Each address record contains:
* Address ID
* User ID
* Address Label
* Full Address
* Pincode
* Area
* Latitude & Longitude
* Landmark
* Default Address

> **Critical Note:** The selected area determines both **serviceability** and **vegetable pricing**.

---

## 2. What ADMIN Can Manage

The Admin panel is the central control system of Womup. Admin has complete control over:
```text
Dashboard              Users                Categories
Vegetables (Products)  Area Management      Area-wise Pricing
Stores (Dark Stores)   Inventory            Orders
Pickers                Riders               Coupons & Offers
Banners & Promotions   Payments & Refunds   Customer Reviews
Push Notifications     Email Campaigns      Reports & Analytics
Settings               Audit Logs
```

---

## 3. Admin Dashboard

Complete 360° business and dark store operational overview.

### KPI Cards
```text
Total Users       Today's Orders     Today's Revenue
Pending Orders    Active Pickers     Active Riders
Low Stock SKUs    Cancelled Orders
```

### Operational Reports
* Daily, Weekly & Monthly Sales
* Area-wise Sales Performance (Bopal, Satellite, SG Highway, Vastrapur, Maninagar)
* Vegetable-wise Sales (Daily Veggies, Leafy Greens, Roots, Exotics)
* Real-time Order & Payment Status
* Rider & Picker Performance Metrics
* Customer Retention & Acquisition Growth

---

## 4. Category Management

Admin creates and organizes vegetable & produce categories:
* Leafy Greens (Palak, Methi, Coriander)
* Root Vegetables (Potato, Onion, Carrot, Ginger)
* Daily Vegetables (Tomato, Cauliflower, Capsicum)
* Exotic Vegetables & Salads (Broccoli, Lettuce, Avocado)
* Fresh Fruits (Apple, Banana)
* Chilli & Fresh Herbs (Hari Mirch, Curry Leaves)

**Fields:** `categoryId`, `name`, `slug`, `description`, `image`, `displayOrder`, `status`, `createdAt`.

---

## 5. Vegetable & Produce Catalog Management

Master catalog repository for all agricultural products.

**Fields & Actions:**
* Add / Edit / Activate / Deactivate Vegetable
* High-res imagery & freshness badges (Harvested Today, Direct from Farm, Grade A)
* Category mapping & SEO-friendly slugs
* Base Unit (e.g., `1 kg`, `500 g`, `250 g`, `100 g`, `1 pc`, `6 pcs`)
* Configurable Weight Variants (e.g. `500 g`, `1 kg`, `2 kg`, `5 kg`)
* Base Selling Price & MRP
* Tax rate & Minimum/Maximum order quantities

> **Core Rule:** **Base price is not necessarily the customer price.** Actual customer price is determined by:  
> `Product + Customer Delivery Area = Area Price`

---

## 6. Area & Dark Store Zone Management

Admin manages Ahmedabad micro-markets and delivery polygon boundaries:
* Bopal / South Bopal (`WM-BOP-01`)
* Satellite / Jodhpur Cross Road (`WM-SAT-02`)
* SG Highway / Bodakdev (`WM-SGH-03`)
* Vastrapur / IIM Road (`WM-VAS-04`)
* Maninagar / Kankaria (`WM-MAN-05`)

**Area Fields:** `areaId`, `areaName`, `city`, `state`, `pincode`, `latitude`, `longitude`, `serviceRadius`, `storeId`, `deliveryFee`, `minimumOrder`, `estimatedDeliveryTime`, `status`.

---

## 7. Area-Wise Dynamic Pricing Management (Core USP)

Agricultural produce prices fluctuate daily based on local mandi rates and logistics costs.

**Matrix Example:**
| Product | Base Unit | Bopal Store | Satellite Store | SG Highway Store |
| :--- | :--- | :--- | :--- | :--- |
| **Hybrid Tomato** | 1 kg | ₹42 / kg | ₹45 / kg | ₹44 / kg |
| **Nashik Red Onion**| 1 kg | ₹36 / kg | ₹39 / kg | ₹38 / kg |
| **Fresh Potato** | 1 kg | ₹32 / kg | ₹35 / kg | ₹34 / kg |

**Capabilities:**
* Real-time price adjustment per dark store zone
* Future scheduled price adjustments (e.g. effective 06:00 AM tomorrow)
* Bulk percentage price calibration per area
* CSV Import / Export for daily mandi rate sync

---

## 8. Dark Store Management

Physical fulfillment facilities optimized for 10-minute picking & dispatch.
* Store Name & Code (`WM-BOP-01`, `WM-SGH-03`)
* Geo-coordinates & Polygon coverage areas
* Operating Hours (06:00 AM – 11:30 PM)
* Crate & Picker Capacity limits
* Staff assignments (Pickers, Packers, Store Manager)

---

## 9. Dark Store Inventory & Batch Adjustments

Store-wise inventory control with stock reservation during checkout:
```text
Bopal Store — Tomato:
Available: 80 kg  |  Reserved in Active Carts: 10 kg  |  Remaining: 70 kg
```
* Physical vs. System stock discrepancy adjustment with audit reasons (e.g., `-4 kg damaged/spoiled`)
* Threshold alert for auto-marking Low Stock or Out of Stock.

---

## 10 & 11. Order Lifecycle & Admin Management

**11-Stage Unified Order Lifecycle:**
```text
PENDING ──► PAYMENT_PENDING ──► CONFIRMED ──► PICKING ──► PACKING ──► READY_FOR_PICKUP
──► RIDER_ASSIGNED ──► OUT_FOR_DELIVERY ──► DELIVERED
(Alternative termination states: CANCELLED / REFUNDED)
```

**Order Details Screen:**
* Order ID (`#WM10231`), Timestamp, Customer details & GPS address
* Item breakdown with weight variant, unit price, quantity, and item subtotal
* Dark Store assignment, Assigned Picker, Assigned Rider
* Payment method & transaction ID
* Real-time status event audit trail

---

## 12–19. Picker Operational SRS (In-Store Fulfillment)

### Picker Profile & Dashboard
* Picker logs in via Phone / Employee ID + PIN.
* Real-time queue: `New Orders`, `Picking`, `Packing`, `Completed`.

### Picking & Weight Verification
* Items displayed in optimal warehouse aisle sequence.
* For weight-based produce (vegetables/fruits): Picker inputs **actual weighed quantity** (e.g., ordered `1.0 kg`, actual weighed `0.98 kg`). System checks configured weight tolerance.

### Substitution Flow
* If an item is out of stock / damaged:
  - Picker marks `OUT OF STOCK` and suggests substitution (e.g., Organic Tomato in lieu of Hybrid).
  - Customer receives interactive prompt in-app to accept, reject, or remove item.
  - Subtotal automatically recalculates.

### Quality Check & Packing
* Mandatory freshness inspection (no wilted greens, bruises, or rot).
* Eco-friendly paper bag packaging, tamper-proof seal, barcoded/QR order receipt attached.
* Picker marks order as `READY_FOR_PICKUP`.

### Picker KPIs
* Orders picked per hour, Average pick time (target < 3.5 minutes), Packing accuracy rate (> 98%).

---

## 20–32. Rider Operational SRS (Last-Mile Delivery)

### Rider Status & Online Availability
* Status states: `OFFLINE`, `ONLINE`, `BUSY`, `ON_DELIVERY`, `SUSPENDED`.
* Rider toggles `GO ONLINE` → GPS broadcast activates → System begins dispatch matching.

### Automated Dispatch & Acceptance
* Algorithm checks: Nearby online riders, current workload, distance to dark store.
* Rider receives order dispatch with Store pickup point, delivery address, payout, and distance.
* Rider accepts → Order moves to `RIDER_ASSIGNED`.

### Store Pickup & Transit
* Rider reaches dark store, shows/scans order code, verifies bag seal.
* Rider clicks `CONFIRM PICKUP` → Order state becomes `OUT_FOR_DELIVERY`.
* Real-time GPS stream published over WebSocket to customer's live tracking screen with animated delivery scooter and dynamic ETA countdown.

### Delivery & OTP Verification
* Rider arrives at customer doorstep.
* Rider requests 4-digit Delivery OTP provided in customer app.
* System validates OTP → Order transitions to `DELIVERED`.
* In case of failed delivery (Customer unreachable / door locked), attempt is logged with timestamp and photo evidence.

### Rider Earnings & Performance
* Daily payout structure: Base delivery fee + distance bonus + peak rush bonus.
* KPIs: Deliveries completed, average transit time (target 7–10 mins), customer rating, on-time percentage.

---

## 33. Multi-Channel Notification System

* **Customer**: Order confirmation, picker started, bag packed, rider assigned, rider arriving (2 mins away), delivery completed.
* **Picker**: Audio chime on new incoming order, priority rush flag, customer substitution response.
* **Rider**: Haptic/audio dispatch alert, pickup readiness alert, address update notices.
* **Admin**: Critical alerts (unassigned orders > 4 mins, low stock alerts, delivery delays > 15 mins).

---

## 34. Role-Based Access Control (RBAC) Matrix

| Feature / Domain | Admin | Picker | Rider | Customer |
| :--- | :---: | :---: | :---: | :---: |
| **Catalog & Base Pricing** | Full Access | No | No | Read Only |
| **Area Dynamic Pricing** | Full Access | **Strictly Forbidden** | **Strictly Forbidden** | Read Only (Zone) |
| **Dark Store Inventory** | Full Access | View & Adjust Picked | No | Read Available Stock |
| **Order Picking & Packing** | Full Monitor | Full Operational | No | View Status |
| **Rider Pickup & Delivery** | Full Monitor | No | Full Operational | Track Realtime |
| **Customer Data & Users** | Full Access | Order Name/Items only | Address & Phone Masked | Own Account Only |
| **Financials & Reports** | Full Access | No | Own Earnings Only | Own Invoices |

> **Fundamental Invariant**: Neither the **Picker** nor the **Rider** can ever modify the **area-wise selling price**. All pricing is governed by the Admin and enforced server-side based on customer geolocation.

---

## 35. REST API Architecture

```http
# Admin Endpoints
GET|POST|PUT   /api/admin/users
GET|POST|PUT   /api/admin/products
GET|POST|PUT   /api/admin/categories
GET|POST|PUT   /api/admin/areas
GET|POST|PUT   /api/admin/area-prices
GET|POST|PUT   /api/admin/stores
GET|POST|PUT   /api/admin/inventory
GET|POST|PUT   /api/admin/orders
GET|POST|PUT   /api/admin/pickers
GET|POST|PUT   /api/admin/riders
GET|POST|PUT   /api/admin/reports

# Picker Endpoints
GET            /api/picker/dashboard
GET            /api/picker/orders
POST           /api/picker/orders/:id/start-picking
POST           /api/picker/orders/:id/verify-item
POST           /api/picker/orders/:id/substitute
POST           /api/picker/orders/:id/pack
POST           /api/picker/orders/:id/ready-for-pickup

# Rider Endpoints
GET            /api/rider/dashboard
POST           /api/rider/status (ONLINE/OFFLINE)
GET            /api/rider/orders/available
POST           /api/rider/orders/:id/accept
POST           /api/rider/orders/:id/pickup
POST           /api/rider/orders/:id/location (GPS Ping)
POST           /api/rider/orders/:id/verify-otp-deliver
GET            /api/rider/earnings
```

---

## 36. Complete End-to-End Operational Pipeline

```text
CUSTOMER
   │
   ▼
Select Location (Ahmedabad Zone: Bopal / Satellite / SG Highway / Vastrapur / Maninagar)
   │
   ▼
Resolve Dark Store (e.g., SG Highway Store WM-SGH-03)
   │
   ▼
Load Area-Calibrated Vegetable Prices & Store Stock
   │
   ▼
Select Weight Variant (500 g, 1 kg, 2 kg, etc.) ──► Real-Time Card Price Sync
   │
   ▼
Add to Cart ──► Checkout ──► Payment Complete
   │
   ▼
ORDER CONFIRMED (Order #WM10231)
   │
   ▼
DARK STORE INVENTORY ALLOCATED
   │
   ▼
PICKER ASSIGNED (Amit — Crate #04)
   │
   ▼
AISLE PICKING & WEIGHT SENSING ──► QUALITY INSPECTION
   │
   ▼
PACKED & SEALED WITH QR ──► STATUS: READY_FOR_PICKUP
   │
   ▼
DISPATCH ALGORITHM SELECTS ONLINE RIDER (Rahul — Bike GJ-01-XX-9821)
   │
   ▼
RIDER ACCEPTS ──► ARRIVES AT STORE ──► SCANS QR ──► STATUS: OUT_FOR_DELIVERY
   │
   ├── WebSocket GPS Stream ──► Customer Sees Live Scooter on Route (ETA 8 mins)
   │
   ▼
RIDER ARRIVES AT DOORSTEP
   │
   ▼
CUSTOMER SHARES 4-DIGIT DELIVERY OTP
   │
   ▼
OTP VALIDATED ──► STATUS: DELIVERED
   │
   ▼
DIGITAL INVOICE ISSUED ──► RIDER EARNING CREDITED ──► CUSTOMER FEEDBACK
```
