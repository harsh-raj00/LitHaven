<div align="center">

# 🏛️ LitHaven

### *A Simple College Book Exchange & Study Notes Sharing Platform*

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

<p align="center">
  <img src="./assets/banner.jpg" alt="LitHaven Hero Banner" width="100%" style="border-radius: 14px; box-shadow: 0 12px 36px rgba(0,0,0,0.6);" />
</p>

**LitHaven** is a complete, full-stack **MERN** application built for college students to **buy and sell used books** and **share study notes** (cheat sheets, lecture summaries, and solved question papers) with classmates on campus with zero commission fees.

[📸 Preview](#-application-preview) · [🚀 Quick Start](#-quick-start) · [🏗️ Architecture & Models](#%EF%B8%8F-architecture--data-models) · [🛡️ Verification](#%EF%B8%8F-verification--testing)

---

</div>

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 📖 Find & Sell Books
- **Live Preview**: See your book card update in real-time as you type title, condition, and price.
- **Smart Savings Calculator**: Shows exact discounts compared to original retail prices.
- **Easy Search & Filters**: Search across titles, authors, and subjects. Filter by condition and price in ₹.
- **Campus Meeting Spots**: Pick safe spots to meet on campus (Library, Canteen, Student Center).
- **Popular Textbook Covers**: Instant cover presets for standard books or upload your own photo.

</td>
<td width="50%">

### 📝 Study Notes & Question Papers
- **Helpful Study Materials**: Access formula sheets, class notes, lab manuals, and solved papers.
- **Download Counter**: See how many students have downloaded each resource.
- **Quick Filters**: Filter notes by subject and semester.
- **File Uploads & Links**: Upload PDFs directly or share links.
- **100% Free**: Always free for student collaboration.

</td>
</tr>
<tr>
<td width="50%">

### 💬 Offers & Messages
- **Direct Messaging**: Make offers and chat directly with sellers to arrange a meeting.
- **Easy Offer Controls**: Sellers can Accept, Decline, or mark orders as Done.
- **Safe Campus Chat**: Keeps students connected without having to share personal phone numbers.
- **Automatic Status Updates**: Books update from `available` → `reserved` → `sold`.

</td>
<td width="50%">

### 🔐 Accounts & Profiles
- **Secure Logins**: Fast and safe token-based sign-in.
- **Saved Books**: Bookmark books you like with a single click.
- **Student Profile**: Manage your active listings, saved books, and uploaded notes in one place.

</td>
</tr>
</table>

---

## 📸 Application Preview

<details open>
<summary>🌗 <strong>Dual Theme Experience (Dark & Light Mode)</strong></summary>
<br/>

| Midnight Atelier (Dark Mode) | Travertine Atelier (Light Mode) |
|:---:|:---:|
| <img src="./assets/screenshots/hero_dark.png" alt="LitHaven Dark Mode" width="100%" style="border-radius: 8px;" /> | <img src="./assets/screenshots/hero_light.png" alt="LitHaven Light Mode" width="100%" style="border-radius: 8px;" /> |

</details>

<br/>

<details open>
<summary>📚 <strong>Campus Catalog & Interactive Bookshelf</strong></summary>
<br/>

| Featured Volumes Catalog | Interactive Library Bookshelf Spines |
|:---:|:---:|
| <img src="./assets/screenshots/featured_books.png" alt="Featured Volumes" width="100%" style="border-radius: 8px;" /> | <img src="./assets/screenshots/interactive_bookshelf.png" alt="Interactive Bookshelf Spines" width="100%" style="border-radius: 8px;" /> |

</details>

<br/>

<details open>
<summary>🔍 <strong>Search Marketplace & Live Listing Creation</strong></summary>
<br/>

| Filterable Books Marketplace | Live 3D Card Listing Preview |
|:---:|:---:|
| <img src="./assets/screenshots/marketplace.png" alt="Search and Filters" width="100%" style="border-radius: 8px;" /> | <img src="./assets/screenshots/sell_book_preview.png" alt="Live 3D Listing Preview" width="100%" style="border-radius: 8px;" /> |

</details>

<br/>

<details open>
<summary>📝 <strong>Study Vault & Student Profile Dashboard</strong></summary>
<br/>

| Study Vault & Academic Resources | Student Profile & Active Listings |
|:---:|:---:|
| <img src="./assets/screenshots/study_vault.png" alt="Academic Resources and Notes" width="100%" style="border-radius: 8px;" /> | <img src="./assets/screenshots/student_dashboard.png" alt="Student Profile Dashboard" width="100%" style="border-radius: 8px;" /> |

</details>

<br/>

<details open>
<summary>💬 <strong>Inquiries, Offers & Direct Campus Chat</strong></summary>
<br/>

<p align="center">
  <img src="./assets/screenshots/messages_chat.png" alt="Direct Campus Chat and Offer Negotiation" width="100%" style="border-radius: 8px;" />
</p>

</details>

---

## 🏗️ Architecture & Data Models

### 📐 System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client ["Client Layer · Frontend (React 19 + Vite)"]
        UI["🖥️ Modern Web UI<br/>(Marketplace, Notes, Chat, Profile)"]
        Context["⚡ Context State<br/>(AuthContext & ToastContext)"]
        APIClient["📡 Axios API Client<br/>(services/api.js)"]
        UI --> Context
        Context --> APIClient
    end

    subgraph Server ["Server Layer · Backend (Node.js + Express)"]
        ServerEntry["Express.js Server (:5001)"]
        MW["Middleware<br/>(CORS, JWT Protect, Error Handler)"]
        
        subgraph Routes ["REST API Controllers"]
            R_Auth["/api/auth<br/>(Auth & Profiles)"]
            R_Books["/api/books<br/>(Books Exchange & Filters)"]
            R_Res["/api/resources<br/>(Academic Notes & Papers)"]
            R_Inq["/api/inquiries<br/>(Offers & Direct Chat)"]
            R_Rev["/api/reviews<br/>(Seller Ratings)"]
            R_Stats["/api/stats<br/>(Community Metrics)"]
        end

        ServerEntry --> MW
        MW --> Routes
    end

    subgraph Data ["Data & Storage Layer"]
        MongoDB[("🍃 MongoDB Database<br/>(Mongoose ODM)")]
        DiskStorage["📁 Static Media Storage<br/>(/uploads)"]
    end

    APIClient -->|"HTTP / REST API (JSON)"| ServerEntry
    Routes -->|"Queries & Mutations"| MongoDB
    R_Books -.->|"Book Cover Uploads"| DiskStorage
    R_Res -.->|"Notes & PDF Uploads"| DiskStorage
```

### 🗄️ Database Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ BOOK : "lists for sale"
    USER ||--o{ RESOURCE : "uploads notes"
    USER ||--o{ INQUIRY : "sends / receives offers"
    USER ||--o{ REVIEW : "writes & receives"
    BOOK ||--o{ INQUIRY : "is topic of"
    BOOK ||--o{ REVIEW : "referenced by"

    USER {
        ObjectId _id PK
        string name
        string email
        string college
        string role
        array wishlist
        number rating
        number reviewCount
    }

    BOOK {
        ObjectId _id PK
        string title
        string author
        string category
        number price
        number originalPrice
        string condition
        string status
        ObjectId seller FK
        string meetingSpot
    }

    RESOURCE {
        ObjectId _id PK
        string title
        string subject
        string fileType
        number downloadCount
        number likes
        ObjectId uploader FK
    }

    INQUIRY {
        ObjectId _id PK
        ObjectId book FK
        ObjectId buyer FK
        ObjectId seller FK
        number offerPrice
        string status
        array messages
    }

    REVIEW {
        ObjectId _id PK
        ObjectId seller FK
        ObjectId reviewer FK
        ObjectId book FK
        number rating
        string comment
    }
```

### 📁 Project Directory Structure

```
LitHaven/
├── backend/
│   ├── models/
│   │   ├── User.js             # Student account, college, rating, wishlist
│   │   ├── Book.js             # Textbook listings, condition, price, cover
│   │   ├── Resource.js         # Scriptorium documents, downloads, tags
│   │   ├── Inquiry.js          # Direct buyer-seller offers & chat messages
│   │   └── Review.js           # Seller ratings and feedback
│   ├── routes/
│   │   ├── authRoutes.js       # Register, login, profile, user lookup
│   │   ├── bookRoutes.js       # Codex Exchange CRUD, filters, wishlist toggle
│   │   ├── resourceRoutes.js   # Scriptorium browse, upload, download counter
│   │   ├── inquiryRoutes.js    # Offers, message sending, status updates
│   │   ├── reviewRoutes.js     # Seller reviews
│   │   └── statsRoutes.js      # Platform impact statistics
│   ├── middleware/
│   │   ├── auth.js             # JWT verification middleware
│   │   └── errorHandler.js     # Centralized error handler
│   ├── seed/
│   │   └── seedData.js         # Comprehensive demo data seeder
│   ├── uploads/                # Static asset storage
│   ├── server.js               # Express application entry point
│   └── .env                    # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, BookCard, ResourceCard, Modals, Toasts
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── pages/              # HomePage, Marketplace (Codex Exchange), StudyVault (Scriptorium), CreateBook, Inquiries, Dashboard
│   │   ├── services/api.js     # Centralized backend API client
│   │   ├── index.css           # Complete vanilla CSS design system
│   │   └── App.jsx             # Main routing and modal coordination
│   ├── public/covers/          # High-resolution book cover assets
│   └── vite.config.js          # Vite config with backend proxy on :5001
└── package.json                # Workspace scripts
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js**: v18+ (tested on Node v24.21)
- **npm**: v9+ (tested on npm 11.19)
- **MongoDB**: v6.0+ (running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

---

### 1️⃣ Clone & Install

```bash
cd LitHaven

# Install dependencies for both backend and frontend
npm --prefix backend install
npm --prefix frontend install
```

---

### 2️⃣ Configure Environment

The backend includes a pre-configured `.env` file. You can adjust the port, MongoDB URI, or JWT secret if needed:

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/lithaven
JWT_SECRET=lithaven_super_secret_jwt_key_2026_modern_mern_academic
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

---

### 3️⃣ Seed Demo Data *(Recommended)*

Populate your MongoDB database with realistic student accounts, textbooks, notes, and active chat offers:

```bash
cd backend
npm run seed
```



---

### 4️⃣ Run the Application

You can run the backend and frontend in separate terminals:

#### Terminal 1 — Backend API
```bash
cd LitHaven/backend
npm start
# Server will run on http://localhost:5001
```

#### Terminal 2 — Frontend App
```bash
cd LitHaven/frontend
npm run dev
# Frontend will open on http://localhost:5173
```

Now open **[http://localhost:5174](http://localhost:5174)** in your browser!

---

## 🌿 Git Branches

LitHaven maintains synchronized branches for production and features:

```bash
# Main production codebase
git checkout main

# Pro UI/UX feature branch
git checkout redesign/pro-uiux
```

- **`main`**: The primary full-stack production codebase with complete frontend, backend, MongoDB Atlas setup, and seed data.
- **`redesign/pro-uiux`**: Feature and development branch for UI/UX iterations and design refinements.



---

## 🛡️ Verification & Testing

- **Backend Health Check**: Accessible at `http://localhost:5001/health`
- **Frontend Build**: Validated with `vite build` — 0 errors, optimized bundle.
- **Database Seeder**: Verified with Mongoose connection and population tests.

---

<div align="center">

**Built with ❤️ for university students everywhere.**

</div>
