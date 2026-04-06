import React from 'react';
import { LayoutDashboard, Receipt, BarChart3 } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
];

export const Sidebar = ({ currentTab, setCurrentTab }) => {
  return (
    <aside className="w-64 bg-surface/80 backdrop-blur-3xl border-r border-border/50 min-h-screen p-4 flex flex-col relative z-20">
      <div className="flex items-center mb-10 px-2 mt-4">
        <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Zorvyn
        </span>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium",
              currentTab === item.id
                ? "bg-primaryDim text-primary"
                : "text-textMuted hover:text-text hover:bg-surface2"
            )}
          >
            <item.icon size={20} className={currentTab === item.id ? "text-primary" : "text-textMuted"} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto px-2 pb-4">
        <div className="glass-card p-4 text-xs text-textMuted">
          <p>Zorvyn Finance</p>
          <p>&copy; 2026 Admin Panel</p>
        </div>
      </div>
    </aside>
  );
};
