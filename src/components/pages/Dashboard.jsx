import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../lib/utils';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export const Dashboard = () => {
  const { transactions } = useFinance();

  const { totalBalance, totalIncome, totalExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === 'Income') income += t.amount;
      else expense += t.amount;
    });
    return { totalIncome: income, totalExpense: expense, totalBalance: income - expense };
  }, [transactions]);

  // Transform data for Area chart (Balance over days)
  const areaData = useMemo(() => {
    // Sort transactions by date ascending
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let currentBalance = 0;
    
    // Group by Date for cleaner chart
    const dailyBalance = {};
    sorted.forEach(t => {
      if (t.type === 'Income') currentBalance += t.amount;
      else currentBalance -= t.amount;
      // Truncate day slightly for display
      const displayDate = t.date.split('-').slice(1).join('/'); 
      dailyBalance[displayDate] = currentBalance;
    });

    return Object.keys(dailyBalance).map(date => ({
      date,
      balance: dailyBalance[date]
    }));
  }, [transactions]);

  // Transform data for Pie chart (Expenses breakdown by category)
  const pieData = useMemo(() => {
    const categories = {};
    transactions.forEach(t => {
      if (t.type === 'Expense') {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      }
    });
    return Object.keys(categories).map(name => ({
      name,
      value: categories[name]
    })).sort((a,b) => b.value - a.value);
  }, [transactions]);

  const COLORS = ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">Overview</h1>
        <p className="text-textMuted">Welcome back. Here's what's happening with your finances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="glass-card p-6 border-primary/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={80} />
          </div>
          <p className="text-textMuted text-sm font-medium mb-1 relative z-10">Total Balance</p>
          <h2 className="text-4xl font-bold text-text mb-4 relative z-10">{formatCurrency(totalBalance)}</h2>
          <div className="flex items-center text-xs font-medium text-success relative z-10 bg-success/10 w-fit px-2 py-1 rounded-full border border-success/20">
            <ArrowUpRight size={14} className="mr-1" />
            +2.4% from last month
          </div>
        </div>

        {/* Total Income */}
        <div className="glass-card p-6">
          <p className="text-textMuted text-sm font-medium mb-1">Total Income</p>
          <h2 className="text-3xl font-bold text-text mb-4">{formatCurrency(totalIncome)}</h2>
          <div className="flex items-center text-xs font-medium text-success bg-success/10 w-fit px-2 py-1 rounded-full border border-success/20">
            <ArrowUpRight size={14} className="mr-1" />
            +18.2% from last month
          </div>
        </div>

        {/* Total Expenses */}
        <div className="glass-card p-6">
          <p className="text-textMuted text-sm font-medium mb-1">Total Expenses</p>
          <h2 className="text-3xl font-bold text-text mb-4">{formatCurrency(totalExpense)}</h2>
          <div className="flex items-center text-xs font-medium text-danger bg-danger/10 w-fit px-2 py-1 rounded-full border border-danger/20">
            <ArrowDownRight size={14} className="mr-1" />
            -4.5% from last month
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart: Balance Trend */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-text">Balance Trend</h3>
              <p className="text-sm text-textMuted">Last 6 months balance movement</p>
            </div>
            <span className="rounded-full border border-border/80 bg-surface px-3 py-1 text-xs font-semibold text-textMuted">
              Updated daily
            </span>
          </div>
          <div className="h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 16, right: 10, left: -10, bottom: 18 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#8b5cf6"
                  opacity={0.7}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  height={28}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#8b5cf6"
                  opacity={0.7}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                  width={72}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--surface2)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text)' }}
                  formatter={(value) => [formatCurrency(value), 'Balance']}
                />
                <Area type="monotone" dataKey="balance" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Spending Breakdown */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-text mb-6">Spending Breakdown</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={56}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                  labelLine={false}
                  label={({ cx, cy, midAngle, outerRadius, percent }) => {
                    return percent > 0.08 ? (
                      <text
                        x={cx + (outerRadius + 10) * Math.cos(-midAngle * (Math.PI / 180))}
                        y={cy + (outerRadius + 10) * Math.sin(-midAngle * (Math.PI / 180))}
                        fill="var(--text)"
                        textAnchor={percent > 0.5 ? 'start' : 'end'}
                        dominantBaseline="central"
                        fontSize={11}
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    ) : null;
                  }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--surface2)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text)' }}
                  formatter={(value) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-border/70 bg-surface px-3 py-3 text-sm shadow-sm">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <p className="font-semibold text-text truncate">{entry.name}</p>
                  </div>
                  <p className="text-xs text-textMuted mt-1 truncate">{formatCurrency(entry.value)}</p>
                </div>
                <span className="text-xs font-semibold text-textMuted text-right min-w-[3rem] flex-shrink-0">
                  {((entry.value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
