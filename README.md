# Cross-Chain Gas Price Tracker & Wallet Simulation Dashboard

A modern, responsive dashboard for tracking gas prices across Ethereum, Polygon, and Arbitrum, simulating wallet transactions, and visualizing gas price volatility with a candlestick chart. Built with Next.js, Zustand, ethers, Alchemy SDK, and lightweight-charts, the UI matches a professional dark dashboard design with a collapsible sidebar and tabbed content.

---

## Features

- **Live Gas Price Tracking:**
  - Real-time gas prices for Ethereum, Polygon, and Arbitrum using Alchemy SDK.
  - Data displayed in a table and visualized as a candlestick chart (gas price volatility).
- **Wallet Simulation:**
  - Simulate sending transactions and estimate gas costs without real blockchain interaction.
  - Tabbed interface for switching between simulation and chart views.
- **Modern Dashboard UI:**
  - Collapsible sidebar with logo, navigation icons, and footer.
  - Responsive design: sidebar overlays on mobile, always visible on desktop.
  - Card-style panels, modern fonts, and a dark color palette.
- **State Management:**
  - Zustand for global state (gas prices, wallet simulation, UI state).
- **Blockchain Data:**
  - ethers.js and Alchemy SDK for reliable, up-to-date blockchain data.
- **Charting:**
  - lightweight-charts v4 for high-performance candlestick charts.

---

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [ethers.js](https://docs.ethers.org/)
- [Alchemy SDK](https://docs.alchemy.com/reference/alchemy-sdk-quickstart)
- [lightweight-charts v4](https://tradingview.github.io/lightweight-charts/)
- TypeScript
- Custom CSS (dark dashboard theme)

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up environment variables:**
   - Create a `.env.local` file with your Alchemy API keys for each chain:
     ```env
     NEXT_PUBLIC_ALCHEMY_ETHEREUM_KEY=your-ethereum-key
     NEXT_PUBLIC_ALCHEMY_POLYGON_KEY=your-polygon-key
     NEXT_PUBLIC_ALCHEMY_ARBITRUM_KEY=your-arbitrum-key
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open the app:**
   - Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

- `src/components/` – UI components (Sidebar, GasTable, GasChart, WalletSimulator, etc.)
- `src/hooks/` – Custom hooks for polling gas prices, Uniswap prices, etc.
- `src/store/` – Zustand stores for app state
- `src/utils/` – Utility functions
- `app/` – Next.js app directory (pages, layout, etc.)
- `public/` – Static assets (logo, icons)

---

## Customization

- **UI Theme:**
  - The dashboard uses a custom dark theme in `globals.css`.
  - Sidebar, cards, and typography match the provided design image.
- **Sidebar:**
  - Add your logo in `src/components/Sidebar.tsx`.
  - Customize navigation items and icons as needed.

---

## License

This project is open source and available under the [MIT License](LICENSE).
