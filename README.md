# BazaarBondhu (বাজারবন্ধু) - Bangladesh Classifieds Marketplace Platform

A modern, scalable, production-ready classified marketplace web application tailored for Bangladesh with an original, premium UI/UX design.

![BazaarBondhu Platform](https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80)

---

## 1. Technology Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes / Node.js
- **Database & ORM**: Prisma ORM with SQLite (preconfigured for zero-setup local execution) & PostgreSQL-ready (`provider = "postgresql"`)
- **Authentication**: JWT & HTTP-Only Secure Cookies, bcrypt password hashing, RBAC (USER, BUSINESS_SELLER, MODERATOR, ADMIN)
- **Internationalization (i18n)**: English + বাংলা (Bangla) bilingual architecture with instant toggle
- **Payment & Boost Integration**: bKash, Nagad, Rocket, Credit/Debit Card payment simulation & server-side verification
- **Search & Filtering**: Multi-facet dynamic filtering with category-specific custom attributes and full text search

---

## 2. User Roles & Seed Credentials

| Role | Name | Phone / Login | Password | Capabilities |
|---|---|---|---|---|
| **ADMIN** | Master Admin | `01711000001` | `admin123` | Full access to moderation queue, analytics, revenue stats, user management, and platform controls |
| **MODERATOR** | Ad Moderation Lead | `01711000002` | `admin123` | Review pending advertisements, approve, reject with reason, handle user reports |
| **BUSINESS_SELLER** | Navana Premier Motors | `01811000003` | `123456` | Verified business badge, showroom profile, multiple listings, priority search |
| **BUSINESS_SELLER** | Gadget Hub BD | `01911000004` | `123456` | Tech showroom in Jamuna Future Park with verified badge & ratings |
| **USER** | Rahim Chowdhury | `01611000005` | `123456` | Post ads, edit, mark as sold, save favorites, 1-to-1 in-app chat, buy promotions |
| **USER** | Nusrat Jahan | `01511000006` | `123456` | Regular buyer/seller |

> *Tip: Click any of the one-click "Instant Demo Logins" on the login modal to log in immediately without typing!*

---

## 3. Bangladesh Location Hierarchy
Covers all 8 administrative divisions of Bangladesh:
1. **Dhaka Division**: Dhaka District (Mirpur, Uttara, Dhanmondi, Gulshan, Banani, Bashundhara R/A, Mohammadpur, Motijheel), Gazipur (Tongi, Gazipur Sadar, Chowrasta), Narayanganj (Sadar, Chashara)
2. **Chattogram Division**: Chattogram District (Agrabad, GEC Circle, Nasirabad, Halishahar), Cox's Bazar (Kolatoli, Marine Drive)
3. **Sylhet Division**: Sylhet District (Zindabazar, Amberkhana, Shahjalal Uposhahar)
4. **Rajshahi Division**: Rajshahi District (Boalia, Motihar)
5. **Khulna Division**: Khulna District (Sonadanga, Khalishpur)
6. **Barishal Division**: Barishal District (Band Road, Natullabad)
7. **Rangpur Division**: Rangpur District (Dap, Jahaz Company)
8. **Mymensingh Division**: Mymensingh District (Ganginar Par, Charpara)

---

## 4. Multi-Step Ad Posting System (`/post-ad`)
- **Step 1: Category Selection**: Vehicles, Property, Electronics, Home & Living, Fashion, Jobs, Services, Agriculture
- **Step 2: Subcategory Selection**: e.g., Cars, Motorcycles, Apartments, Mobile Phones, Laptops, etc.
- **Step 3: Ad Details & Dynamic Fields**:
  - Automatically loads category-specific specifications (e.g. Brand, Model, Year, Fuel, Transmission, Mileage, Engine CC for Vehicles; Bedrooms, Bathrooms, Sqft, Floor, Furnishing for Property; Storage, RAM, Warranty for Mobile Phones)
  - Common fields: Title, Price in BDT (৳), Price Negotiable checkbox, Condition (Brand New, Used, Refurbished), Description
- **Step 4: Image Management**:
  - Multiple image uploader
  - Cover photo selection
  - Photo removal and reordering
  - Quick demo preset buttons
- **Step 5: Location Hierarchy**: Division &rarr; District &rarr; Upazila / Area &rarr; Street Address
- **Step 6: Phone Privacy & Contact**: Choose whether to display mobile number publicly or require buyers to use in-app chat
- **Step 7: Live Preview Card & Submit**: Instant card rendering before publication

---

## 5. Promotion & Payment System (`/ad/[id]/promote`)
Paid promotional packages:
- **Featured Ad (৳500 / 7 Days)**: Golden highlight border and 5x search impressions
- **Top Ad (৳900 / 7 Days)**: Pinned to the top 3 slots of category listings
- **Urgent Badge (৳300 / 5 Days)**: Blazing red badge for fast cash clearance
- **Homepage Spotlight (৳1,500 / 7 Days)**: Front-page showcase exposure
- **Bump Up (৳150 / Instant)**: Refreshes timestamp to the top of fresh listings

Supported Payment Gateways:
- **bKash** (Mobile Financial Service)
- **Nagad** (Post Office Digital Banking)
- **Rocket** (Dutch-Bangla Bank MFS)
- **Debit / Credit Card** (Visa / Mastercard)
- Interactive PIN/OTP verification with server-side transaction recording and instant badge activation.

---

## 6. Real-Time Chat System (`/dashboard/messages`)
- 2-Pane Messenger-style marketplace chat linked directly to advertisement listings
- Unread/read status tracking
- Conversation history with timestamps and relative time (e.g., "5m ago", "৫ মিনিট আগে")
- Direct seller contact launcher from every ad details page

---

## 7. Admin & Moderation Dashboard (`/admin`)
- **Real-Time KPIs**: Pending ads, Total live listings, Platform Revenue, Open user reports
- **Moderation Queue**: Quick preview of pending submissions with one-click **Approve** or **Reject** with custom rejection reason
- **User Management**: Grant/Revoke verified business showroom badge, switch roles
- **Reports Resolution**: Action reports on scams, replicas, or spam listings

---

## 8. Setup & Running Locally

### Prerequisites
- Node.js v18+ or v20+ / v24+
- npm

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Push Prisma schema to SQLite database
npx prisma db push

# 3. Seed database with Bangladesh marketplace data
npm run seed

# 4. Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 9. Switching to Production PostgreSQL
To switch from SQLite to PostgreSQL:
1. Open `prisma/schema.prisma`
2. Change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Update `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/bazaarbondhu?schema=public"
   ```
4. Run `npx prisma db push && npm run seed`

---

## 10. SEO & Performance
- SSR (Server-Side Rendering) on Homepage, Search, Ad Details, and Seller Profiles
- Semantic HTML5 tags and rich OpenGraph metadata
- Dynamic responsive layouts with native smartphone bottom navigation
