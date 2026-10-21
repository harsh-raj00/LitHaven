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

[🚀 Quick Start](#-quick-start) · [📡 API Reference](#-api-reference) · [🏗️ Architecture & Models](#%EF%B8%8F-architecture--data-models) · [🎨 Design](#-visual-identity--ux) · [📚 Books Gallery](#-books-gallery)

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
- **1-Click Demo Accounts**: Test immediately with Engineering, Medical, or Business student accounts.
- **Saved Books**: Bookmark books you like with a single click.
- **Student Profile**: Manage your active listings, saved books, and uploaded notes in one place.

</td>
</tr>
</table>

---

## 🎨 Visual Identity & UX

LitHaven is crafted with an immersive **Obsidian Atelier** aesthetic:
- **Dual Theme Support**: *Midnight Atelier* (cosmic obsidian `#06080d`, aurora violet glow, solar amber) and *Travertine Atelier* (warm Italian sandstone, oatmeal, and parchment light mode).
- **Tactile Hardcover Physics**: Realistic 3D book spine highlights and deep drop-shadow elevations (`-8px translate`) that recreate the sensation of browsing physical library monographs.
- **Glassmorphic UI**: `backdrop-filter: blur(20px)` panels with fine gold hairlines (`rgba(230, 180, 80, 0.35)`).
- **Typography**: Curated pairing — **Cinzel** (monumental serif for headers), **Outfit** (modern geometric headings), **Plus Jakarta Sans** (clean body text), and **JetBrains Mono** (for pricing & badges).
- **Toast Notifications**: Non-intrusive feedback for saves, uploads, inquiries, and profile updates.

---

## 📚 Bespoke Monograph Gallery

Each academic volume features original 3D hardcover artwork generated specifically for LitHaven:

<table>
<tr>
<td width="25%" align="center">
<img src="./assets/covers/cover_quantum.jpg" width="100%" style="border-radius: 8px;" alt="Quantum Dynamics" />
<br/>
<strong>Quantum Dynamics</strong>
<br/>
<sub>Dr. Adrian Vance</sub>
<br/>
<small><em>Quantum Physics</em></small>
</td>

<td width="25%" align="center">
<img src="./assets/covers/cover_neural.jpg" width="100%" style="border-radius: 8px;" alt="Neural Architectures" />
<br/>
<strong>Neural Architectures</strong>
<br/>
<sub>Dr. Eleanor Vance</sub>
<br/>
<small><em>AI & Deep Learning</em></small>
</td>

<td width="25%" align="center">
<img src="./assets/covers/cover_genomic.jpg" width="100%" style="border-radius: 8px;" alt="Genomic Medicine" />
<br/>
<strong>Genomic Medicine</strong>
<br/>
<sub>Reed & Chen</sub>
<br/>
<small><em>Molecular Genetics</em></small>
</td>

<td width="25%" align="center">
<img src="./assets/covers/cover_astrophysics.jpg" width="100%" style="border-radius: 8px;" alt="Deep Astrophysics" />
<br/>
<strong>Deep Astrophysics</strong>
<br/>
<sub>Reed & Elias</sub>
<br/>
<small><em>Cosmology</em></small>
</td>
</tr>

<tr>
<td width="25%" align="center">
<img src="./assets/covers/cover_finance.jpg" width="100%" style="border-radius: 8px;" alt="Quantitative Capital" />
<br/>
<strong>Quantitative Capital</strong>
<br/>
<sub>Vance & Desai</sub>
<br/>
<small><em>Computational Finance</em></small>
</td>

<td width="25%" align="center">
<img src="./assets/covers/cover_cybernetics.jpg" width="100%" style="border-radius: 8px;" alt="Cybernetic Systems" />
<br/>
<strong>Cybernetic Systems</strong>
<br/>
<sub>Advanced Tech Press</sub>
<br/>
<small><em>Robotics & Controls</em></small>
</td>

<td width="25%" align="center">
<img src="./assets/covers/cover_jurisprudence.jpg" width="100%" style="border-radius: 8px;" alt="Ethical Jurisprudence" />
<br/>
<strong>Ethical Jurisprudence</strong>
<br/>
<sub>Aaron J. Vance</sub>
<br/>
<small><em>Legal Philosophy</em></small>
</td>

<td width="25%" align="center">
<img src="./assets/covers/cover_topology.jpg" width="100%" style="border-radius: 8px;" alt="Algebraic Topology" />
<br/>
<strong>Algebraic Topology</strong>
<br/>
<sub>Hatcher & Stein</sub>
<br/>
<small><em>Pure Mathematics</em></small>
</td>
</tr>
</table>

---

## 🏗️ Architecture & Data Models

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

<details>
<summary>🔑 <strong>Demo Accounts Included</strong></summary>

| Student | Email | Password | Academic Discipline | University |
|---|---|---|---|---|
| **Aanya Sharma** | `aanya@lithaven.edu` | `password123` | Computer Science & AI | IIT Delhi |
| **Dr. Marcus Vance** | `marcus@lithaven.edu` | `password123` | Medicine & Surgery | AIIMS New Delhi |
| **Sophia Chen** | `sophia@lithaven.edu` | `password123` | Commerce & Finance | SRCC / Delhi Univ |
| **Rohan Deshmukh** | `rohan@lithaven.edu` | `password123` | Electrical & Math | BITS Pilani |

*Tip: The web UI features instant 1-click login buttons for all demo personas!*

</details>

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

## 🌿 Git Branches & Reversible Architecture

LitHaven features a strict Git branch architecture for zero-risk testing and evaluation:

```bash
# To view all branches
git branch

# Currently on the Redesigned Human-Crafted Editorial Experience:
git checkout redesign/pro-uiux

# To return to the Original Baseline State:
git checkout main
```

- **`main`**: The clean original backup state of LitHaven before the UI/UX redesign.
- **`redesign/pro-uiux`**: The completely redesigned production application with editorial typography, tactile 3D spine lighting, multi-view exchange (Grid, Ledger, Bookshelf), and collegiate academic aesthetics.

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register a new student account | No |
| `POST` | `/api/auth/login` | Authenticate and retrieve JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile and wishlist | 🔒 Yes |
| `PUT` | `/api/auth/profile` | Update profile (college, department, bio) | 🔒 Yes |
| `GET` | `/api/auth/user/:id` | View any student's public profile & listings | No |

### 📖 Books Marketplace (`/api/books`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/books` | Browse books with search, filters, and pagination | No |
| `GET` | `/api/books/featured` | Get top-viewed and trending textbooks | No |
| `GET` | `/api/books/categories` | Get category breakdown with counts | No |
| `GET` | `/api/books/my-listings` | Fetch current user's listings | 🔒 Yes |
| `GET` | `/api/books/:id` | Get book details & increment views | No |
| `POST` | `/api/books` | Create a new book listing (supports image upload) | 🔒 Yes |
| `PUT` | `/api/books/:id` | Update a listing (owner only) | 🔒 Yes |
| `DELETE` | `/api/books/:id` | Remove a listing (owner only) | 🔒 Yes |
| `POST` | `/api/books/:id/wishlist` | Toggle book in user's wishlist | 🔒 Yes |

### 📝 The Scriptorium (`/api/resources`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/resources` | Browse study materials (filter by file type/subject) | No |
| `GET` | `/api/resources/my-resources` | Get current user's uploaded resources | 🔒 Yes |
| `GET` | `/api/resources/:id` | Get resource details | No |
| `POST` | `/api/resources/:id/download` | Register download and increment counter | No |
| `POST` | `/api/resources` | Upload notes/cheat sheet (multipart or link) | 🔒 Yes |
| `DELETE` | `/api/resources/:id` | Remove a resource (uploader only) | 🔒 Yes |

### 💬 Inquiries & Offers (`/api/inquiries`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/inquiries` | Send an offer & start a handover chat | 🔒 Yes |
| `GET` | `/api/inquiries/my-inquiries` | Get all active conversation threads | 🔒 Yes |
| `GET` | `/api/inquiries/:id` | Get specific chat thread & messages | 🔒 Yes |
| `POST` | `/api/inquiries/:id/messages` | Send message in inquiry thread | 🔒 Yes |
| `PUT` | `/api/inquiries/:id/status` | Update status (`accepted`, `declined`, `completed`) | 🔒 Yes |

### 📊 Platform Analytics (`/api/stats`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/stats` | Community metrics (active books, savings, campuses) | No |

---

## 🛡️ Verification & Testing

- **Backend Health Check**: Accessible at `http://localhost:5001/health`
- **Frontend Build**: Validated with `vite build` — 0 errors, optimized bundle.
- **Database Seeder**: Verified with Mongoose connection and population tests.

---

<div align="center">

**Built with ❤️ for university students everywhere.**

</div>
