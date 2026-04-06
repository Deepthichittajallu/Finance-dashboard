import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/pages/Dashboard';
import { Transactions } from './components/pages/Transactions';
import { Insights } from './components/pages/Insights';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob pointer-events-none z-0 dark:bg-primary/10 dark:mix-blend-screen"></div>
      <div className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-secondary/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-2000 pointer-events-none z-0 dark:bg-secondary/10 dark:mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[45rem] h-[45rem] bg-success/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-4000 pointer-events-none z-0 dark:bg-success/10 dark:mix-blend-screen"></div>

      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto animation-fade-in relative">
            {currentTab === 'dashboard' && <Dashboard />}
            {currentTab === 'transactions' && <Transactions />}
            {currentTab === 'insights' && <Insights />}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
