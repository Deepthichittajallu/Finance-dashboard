# Finance Dashboard UI

This is my submission for the Frontend Developer Intern assignment. I built a modern, responsive, and visually clean Finance Dashboard that allows users to rapidly track their financial activity and understand their spending habits.

## Features & Implementation

### 1. Dashboard Overview
- **Summary Metrics**: Displays core indicators including Total Balance, Total Income, and Total Expenses.
- **Data Visualizations**: Uses `recharts` to render a **Balance Trend** (Area Chart) showing change over time and a **Spending Breakdown** (Pie Chart) categorizing outbound cash flow.

### 2. Transactions & Data Management
- **Transaction Ledger**: A fully searchable and filterable list (by Income/Expense) of all financial records.
- **Export to CSV**: Users can download their currently filtered view of transactions neatly into a CSV file via the UI.
- **State Management**: Orchestrated using React's **Context API** (`FinanceContext.jsx`) and `useReducer` to safely store, manipulate, and dispatch transactional data globally without prop drilling. 
- **Data Persistence**: Transactions are stored locally in the browser's `localStorage` so data remains even if the page reloads.

### 3. Simulated Role-Based Access Control (RBAC)
- **Viewer Role**: The default state, allowing read-only access to charts, insights, and transactions data.
- **Admin Role**: Safely toggled via the profile button in the Header. Unlocks the ability to **Add**, **Edit**, and **Delete** transactions directly from the frontend interface.

### 4. Smart Insights
- Contains a dedicated analysis view (`Insights.jsx`) parsing the existing transactions list dynamically.
- Automatically calculates visual highlights such as **Top Expense Category**, overall **Savings Rate**, and actionable textual observations based on positive or negative net balance.

### 5. Technical Highlights
- **Dark Mode**: Fully mapped to CSS variables.
- **Data Persistence**: We just finished syncing the transactions array natively to `localStorage`.
- **Mock API Integration**: The `setInterval` effectively acts as a webhook feeding you dynamic data without a backend.
- **Animations**: Subtle CSS transitions, framer-like fade-ins on the layout, and floating Orbs.
- **Export CSV**: Fully working custom parser attached to an `<a>` tag in JS.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Development Server**
   ```bash
   npm run dev
   ```

3. **View Application**
   Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite in the terminal output).

Thank you for reviewing my project!
