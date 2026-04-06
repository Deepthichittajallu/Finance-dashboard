# Finance Dashboard UI

A modern, responsive finance dashboard built with React, Vite, Tailwind CSS, and Recharts. Designed to showcase clean data visualizations, transaction management, and local persistence for a polished frontend experience.

## Project Overview

This dashboard simulates a personal finance management application. It provides:
- a balance trend area chart,
- spending breakdown visualization,
- searchable transaction history,
- role-based action control,
- and persistent local data caching.

## Key Features

### Dashboard & Visualizations
- **Balance Trend**: Area chart showing balance evolution over time.
- **Spending Breakdown**: Pie chart that displays expense categories and relative distribution.
- **Responsive Layout**: Mobile-friendly grid layout with adaptive cards.

### Transactions
- **Search & Filter**: Filter transactions by type and search by description or category.
- **CRUD Operations**: Add, edit, and delete transactions while in Admin mode.
- **Export CSV**: Download the displayed transaction set as a CSV report.

### User Experience
- **Dark Mode Support**: Theme toggling between light and dark modes using CSS variables.
- **Notifications**: Interactive dropdown notifications for transaction alerts and updates.
- **Insights**: Derived metrics and category analysis from the current transaction dataset.

## Technical Stack

- **React 19**
- **Vite**
- **Tailwind CSS**
- **Recharts**
- **date-fns**
- **Context API + useReducer**

## Architecture

- `src/context/FinanceContext.jsx` manages global app state for transactions, notifications, and user role.
- `src/components/pages` contains the main page views: `Dashboard`, `Insights`, and `Transactions`.
- `src/components/layout` contains reusable UI elements such as the `Header` and `Sidebar`.
- `src/lib/utils.js` contains shared utility functions and formatting helpers.

## Getting Started

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Run lint checks
```bash
npm run lint
```

## Usage Notes

- The application seeds the dashboard with mock financial data when no existing local data is found.
- Notifications are simulated and stored locally for demo purposes.
- The Admin role is toggled from the header and enables editing capabilities.

## Why this project?

This dashboard demonstrates a clear, usable frontend with:
- data-driven UI,
- clean component structure,
- responsive layout,
- state persistence,
- and a refined visual design suitable for portfolio presentation.

## Contact

For questions or feedback, refer to the project files and component structure inside the repository.
