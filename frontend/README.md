# 🟩 Frontend – React + Redux Toolkit

## 🌟 Overview

This is the **frontend** for the Order Management System. It provides a modern, responsive UI for users to select products (fetched from the .NET 8 API), fill out their details, and submit orders (to the Node.js backend). The app is built with React, Redux Toolkit, and Vite, and supports Hebrew product data.

### 🎯 Key Features

- **Product Selection**: Browse and select products from Hebrew catalog
- **Order Management**: Complete order forms with validation
- **Real-time State**: Redux-powered state management
- **Responsive Design**: Mobile-friendly UI with RTL support
- **API Integration**: Seamless connection to dual backend system

---

## 🏗️ System Architecture

```mermaid
graph LR
    subgraph "React Frontend"
        A[App.tsx<br/>Main Router]
        P[Pages<br/>ProductSelection<br/>OrderSummary<br/>Index]
        S[Store<br/>Redux Toolkit<br/>productSlice<br/>orderSlice]
        C[Components<br/>Shadcn UI<br/>Custom Components]
        API[Services<br/>api.ts<br/>Axios Client]
    end

    subgraph "External APIs"
        NET[.NET 8 API<br/>Port 5039<br/>Products/Categories]
        NODE[Node.js API<br/>Port 5000<br/>Order Submission]
    end

    A -->|Routing| P
    P -->|State Management| S
    P -->|UI Rendering| C
    P -->|Data Fetching| API
    API -->|GET /api/categories| NET
    API -->|POST /api/orders| NODE

    style A fill:#fff3e0
    style P fill:#e8f5e8
    style S fill:#f3e5f5
    style C fill:#e1f5fe
    style API fill:#f1f8e9
    style NET fill:#e0f2f1
    style NODE fill:#fce4ec
```

---

## 🔄 Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Redux as Redux Store
    participant NET8 as .NET 8 API
    participant Node as Node.js Backend
    participant Mongo as MongoDB

    Frontend->>NET8: GET /api/categories
    NET8-->>Frontend: Categories & Products (JSON)
    Frontend->>Redux: Store products in productSlice
    User->>Frontend: Selects products, fills form
    Frontend->>Redux: Update orderSlice with selections
    Frontend->>Node: POST /api/orders (user details + selected products)
    Node->>Mongo: Save order
    Mongo-->>Node: Confirmation
    Node-->>Frontend: Success/Error
    Frontend->>Redux: Update orderSlice with result
    Frontend-->>User: Shows result
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/              # Main application pages
│   │   ├── Index.tsx       # Home page with navigation
│   │   ├── ProductSelection.tsx  # Product browsing & selection
│   │   ├── OrderSummary.tsx      # Order review & form submission
│   │   └── NotFound.tsx    # 404 error page
│   ├── store/              # Redux state management
│   │   ├── store.ts        # Redux store configuration
│   │   ├── productSlice.ts # Product state management
│   │   ├── orderSlice.ts   # Order state management
│   │   └── hooks.ts        # Redux hooks
│   ├── services/           # API and external services
│   │   └── api.ts          # Axios client for API calls
│   ├── components/         # Reusable UI components
│   │   └── ui/             # Shadcn UI component library
│   ├── hooks/              # Custom React hooks
│   │   ├── use-mobile.tsx  # Mobile detection hook
│   │   └── use-toast.ts    # Toast notification hook
│   ├── lib/                # Utility libraries
│   │   └── utils.ts        # Helper functions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration with proxy
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

### 🔑 Key Files

- **`src/pages/ProductSelection.tsx`** – Main product browsing interface
- **`src/pages/OrderSummary.tsx`** – Order completion interface
- **`src/store/productSlice.ts`** – Product state management
- **`src/store/orderSlice.ts`** – Order state management
- **`src/services/api.ts`** – API communication layer
- **`vite.config.ts`** – Development configuration

---

## 🚀 Installation & Launch

### Prerequisites

- **Node.js** (v16+)
- **npm**
- **Both backends running** (see backend READMEs)

### Steps

```bash
cd frontend
npm install
npm run dev
# App will be available at http://localhost:8080
```

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

---

## 🛠️ Troubleshooting

- **App won't load?** Make sure you're visiting the correct URL: http://localhost:8080
- **API errors?** Ensure both backends are running (ports 5000 and 5039)
- **Build errors?** Check TypeScript compilation with `npm run type-check`
- **CORS errors?** Verify backend CORS configurations allow port 8080

---

## 📝 Notes

- Fetches product/category data from the .NET 8 API
- Submits orders to the Node.js backend
- All product data is in Hebrew
- Uses Redux Toolkit for predictable state management
- Implements responsive design with Tailwind CSS

---

## 📚 More Info

- See the main [README.md](../README.md) for full system overview
- See `backend/README.md` for Node.js backend details
- See `ProductAPI/README.md` for .NET 8 backend details
