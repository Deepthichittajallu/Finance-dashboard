import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { format, subMonths } from 'date-fns';
import { formatCurrency } from '../lib/utils';

const generateMockTransactions = () => {
  const transactions = [];
  const categories = {
    Income: ['Salary', 'Freelance Work', 'Investment Returns', 'Business Revenue'],
    Expense: ['Groceries', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Dining', 'Rent']
  };

  // Generate transactions for the last 6 months
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(new Date(), i);
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    
    // Generate 15-25 transactions per month
    const numTransactions = Math.floor(Math.random() * 11) + 15;
    
    for (let j = 0; j < numTransactions; j++) {
      const isIncome = Math.random() > 0.7; // 30% income, 70% expense
      const type = isIncome ? 'Income' : 'Expense';
      const categoryList = categories[type];
      const category = categoryList[Math.floor(Math.random() * categoryList.length)];
      
      let amount;
      if (isIncome) {
        amount = Math.floor(Math.random() * 5000) + 2000; // $2000-$7000 for income
      } else {
        amount = Math.floor(Math.random() * 500) + 20; // $20-$520 for expenses
      }
      
      // Random day in the month
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      const transactionDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      
      transactions.push({
        id: crypto.randomUUID(),
        description: `${category} - ${format(transactionDate, 'MMM dd')}`,
        amount: Number(amount.toFixed(2)),
        category,
        type,
        date: format(transactionDate, 'yyyy-MM-dd'),
      });
    }
  }
  
  // Sort by date descending (newest first)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generateMockNotifications = () => {
  return [
    {
      id: crypto.randomUUID(),
      title: 'Large Transaction Alert',
      message: 'You made a transaction over $1,000. Review your spending.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: false,
    },
    {
      id: crypto.randomUUID(),
      title: 'Monthly Budget Exceeded',
      message: 'Your entertainment spending has exceeded the monthly budget by 15%.',
      type: 'danger',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
    },
    {
      id: crypto.randomUUID(),
      title: 'Savings Goal Achieved',
      message: 'Congratulations! You\'ve reached your emergency fund goal of $10,000.',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true,
    },
    {
      id: crypto.randomUUID(),
      title: 'New Feature Available',
      message: 'Check out the new insights dashboard for better financial analysis.',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      read: true,
    },
    {
      id: crypto.randomUUID(),
      title: 'Payment Reminder',
      message: 'Your credit card payment of $450 is due in 3 days.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      read: false,
    },
  ];
};

const loadInitialNotifications = () => {
  try {
    const saved = localStorage.getItem('financeDashboardNotifications');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load notifications from storage', e);
  }
  return generateMockNotifications();
};

const loadInitialTransactions = () => {
  // For demo purposes, always load mock data
  // In production, you might want to check localStorage
  return generateMockTransactions();
};

const initialState = {
  transactions: loadInitialTransactions(),
  notifications: loadInitialNotifications(),
  role: 'Viewer', // Simplified RBAC simulation
};

function financeReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      // Limit to 500 to avoid localStorage bloat in live-sim mode
      const newTransactions = [action.payload, ...state.transactions].slice(0, 500);
      return { ...state, transactions: newTransactions };
    }
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 100), // Keep max 100 notifications
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    default:
      return state;
  }
}

const FinanceContext = createContext(undefined);

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Persist state changes to Local Storage
  useEffect(() => {
    localStorage.setItem('financeDashboardTransactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem('financeDashboardNotifications', JSON.stringify(state.notifications));
  }, [state.notifications]);

  const addTransaction = (transaction) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID() };
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: newTransaction,
    });

    // Generate notifications for large transactions
    if (newTransaction.amount >= 1000) {
      addNotification({
        title: 'Large Transaction Alert',
        message: `You made a ${newTransaction.type.toLowerCase()} transaction of ${formatCurrency(newTransaction.amount)} in ${newTransaction.category}.`,
        type: 'warning',
        read: false,
      });
    }
  };

  const editTransaction = (transaction) => {
    dispatch({ type: 'EDIT_TRANSACTION', payload: transaction });
  };

  const deleteTransaction = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const setRole = (role) => {
    dispatch({ type: 'SET_ROLE', payload: role });
  };

  const addNotification = (notification) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { ...notification, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
    });
  };

  const markNotificationRead = (id) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const markAllNotificationsRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  };

  const deleteNotification = (id) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
  };

  // Enterprise Feature: Realtime data stream simulating live transactions
  useEffect(() => {
    const categories = ['Income', 'Groceries', 'Entertainment', 'Utilities', 'Dining', 'Health', 'Shopping', 'Investments'];
    const descriptions = {
      'Income': ['Corporate Payment', 'Client Retainer', 'SaaS Subscription', 'B2B Invoice', 'Ad Revenue'],
      'Groceries': ['Fresh Market', 'Costco Wholesale', 'Farm Delivery'],
      'Entertainment': ['Corporate Retreat', 'Team Lunch', 'SaaS Tools', 'AWS Bill'],
      'Utilities': ['Digital Ocean', 'Google Cloud', 'Server Costs', 'Domain Renewal'],
      'Dining': ['Client Dinner', 'Catered Lunch', 'Cafe Meeting'],
      'Health': ['Corporate Wellness', 'Health Insurance Premium'],
      'Shopping': ['Office Supplies', 'New Workstation', 'Software Licenses'],
      'Investments': ['Market Fund', 'Treasury Yield', 'R&D Allocation']
    };

    // Simulate incoming data every 4.5 seconds
    const interval = setInterval(() => {
      const isIncome = Math.random() > 0.6; // Slightly biased towards income
      let category;
      if (isIncome) {
        category = Math.random() > 0.5 ? 'Income' : 'Investments';
      } else {
        const expenseCategories = categories.filter(c => c !== 'Income' && c !== 'Investments');
        category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      }

      const descArray = descriptions[category] || ['General Operating'];
      const description = descArray[Math.floor(Math.random() * descArray.length)];
      
      let amount;
      if (isIncome) {
        amount = Math.floor(Math.random() * 15000 * 100) / 100 + 500;
      } else {
        amount = Math.floor(Math.random() * 2500 * 100) / 100 + 50;
      }

      const newTx = {
        id: crypto.randomUUID(),
        description,
        amount: Number(amount.toFixed(2)),
        category,
        type: isIncome ? 'Income' : 'Expense',
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'), // Simulate exact incoming time
      };

      dispatch({ type: 'ADD_TRANSACTION', payload: newTx });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <FinanceContext.Provider
      value={{ 
        ...state, 
        addTransaction, 
        editTransaction, 
        deleteTransaction, 
        setRole,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
