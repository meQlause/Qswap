# Qswap

A modern DeFi application built with **React** and **TypeScript**, designed to provide a sleek and responsive interface for token swaps and liquidity pool management.

> ⚠️ **Disclaimer:**  
> This project currently uses **local storage** to store token and pool data. This setup is for development and testing purposes only. A proper backend and persistent storage will be implemented in future updates. Please do **not** use this in production or with real assets.

---

## 🚀 Features

- 🎨 Clean, responsive UI with smooth transitions  
- 💱 Token swap functionality  
- 💧 Liquidity pool creation and management  
- 🌙 Dark theme optimized for DeFi applications  
- 📱 Mobile-first design  

---

## 🧰 Tech Stack

- React  
- TypeScript  
- Tailwind CSS  
- CSS Grid & Flexbox  
- Vite  

---

## 🛠 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd project-bolt
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

App will be available at:  
`http://localhost:3000`

---

## 📁 Project Structure

```
contracts/
|-- .....
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── Swap/
│   │   └── SwapCard.tsx
│   └── Pools/
│       └── PoolsCard.tsx
└── App.tsx
```

---

## 🧪 Development Notes

- Uses **TypeScript** for static typing  
- **Tailwind CSS** for utility-first styling  
- Custom scrollbars and dark theme for better UX  
- Currently relies on **local storage** for data — this is temporary and will be replaced with backend integration (e.g., Firebase, Supabase, or custom API)

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for full terms.
