# WOMUP Express — 10-Minute Farm-Fresh Vegetable & Fruit Delivery

WOMUP is an ultra-fast quick-commerce ecosystem tailored for Ahmedabad's fresh produce market. It features hyper-localized dark store inventory, area-calibrated pricing, weight-based variant scaling, and multi-role operational dashboards.

---

## 📚 Project Documentation

* **[Role Management & Operations SRS](file:///Users/thankiayushi/Desktop/%20Wormup%20E-com/WOMUP_OPERATIONS_SRS.md)**: Detailed specification for Admin, Picker, Rider, and Customer roles, order lifecycle, substitution flow, and RBAC security rules.

---

## 👥 Operational Roles

| Role | Responsibility | Access Boundary |
| :--- | :--- | :--- |
| **Admin** | Business oversight, dark store management, master produce catalog, dynamic area pricing, campaigns & analytics. | Full System Control |
| **Picker** | In-store warehouse fulfillment, item picking sequence, weight tolerance check, quality inspection & packing. | Store Orders & Inventory |
| **Rider** | Last-mile transit, store pickup QR scan, live GPS broadcast, and doorstep delivery OTP validation. | Assigned Dispatches & Route |
| **Customer** | Area selection (Ahmedabad zones), weight variant selection (`500 g`, `1 kg`, etc.), real-time cart, checkout & live order tracking. | Personal Account & Orders |

---

## ⚡ Tech Stack

* **Frontend**: React 18, Vite, Context API (Location, Products, Cart, Orders, App)
* **Styling**: Womup Brand Design System (Vanilla CSS with CSS variables, Glassmorphism, Micro-animations)
* **State Management**: Zero external overhead; synchronized local state + storage persistence
* **Routing / Portals**: Customer Storefront (`/`), Admin Console (`/admin`), Store Picker View (`/store`), Rider Dispatch (`/rider`)

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```
