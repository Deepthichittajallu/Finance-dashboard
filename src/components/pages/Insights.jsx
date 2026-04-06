import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, cn } from '../../lib/utils';
import { TrendingUp, AlertCircle, Award, Target, CalendarDays, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const Insights = () => {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    let income = 0;
    let expense = 0;
    let thisMonthSpend = 0;
    let lastMonthSpend = 0;
    const categorySpending = {};
    const now = new Date();

    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const diffTime = Math.abs(now - tDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (t.type === 'Income') {
        income += t.amount;
      } else {
        expense += t.amount;
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
        
        if (diffDays <= 30) thisMonthSpend += t.amount;
        else if (diffDays > 30 && diffDays <= 60) lastMonthSpend += t.amount;
      }
    });

    const highestCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];
    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

    let monthCompareValue = 0;
    let monthCompareText = "No previous data";
    if (lastMonthSpend > 0) {
      monthCompareValue = ((thisMonthSpend - lastMonthSpend) / lastMonthSpend) * 100;
      monthCompareText = `${Math.abs(monthCompareValue).toFixed(1)}% vs Last 30d`;
    } else if (thisMonthSpend > 0) {
      monthCompareText = "New active spending";
    }

    return {
      highestCategory: highestCategory ? { name: highestCategory[0], amount: highestCategory[1] } : null,
      savingsRate: savingsRate.toFixed(1),
      netBalance: income - expense,
      totalIncome: income,
      totalExpense: expense,
      thisMonthSpend,
      monthCompareValue,
      monthCompareText
    };

  }, [transactions]);

  if (!insights) {
    return (
      <div className="text-center py-20 animate-in fade-in">
        <h2 className="text-2xl font-bold text-text mb-2">No Insights Available</h2>
        <p className="text-textMuted">Add some transactions to generate insights.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">Insights</h1>
        <p className="text-textMuted">AI-driven patterns and observations from your spending.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="w-12 h-12 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-4">
            <Target size={24} />
          </div>
          <p className="text-textMuted text-sm font-medium mb-1">Top Expense Category</p>
          <h3 className="text-xl font-bold text-text mb-1">{insights.highestCategory?.name || 'N/A'}</h3>
          <p className="text-sm font-medium text-danger">{formatCurrency(insights.highestCategory?.amount || 0)}</p>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
            <Award size={24} />
          </div>
          <p className="text-textMuted text-sm font-medium mb-1">Savings Rate</p>
          <h3 className="text-xl font-bold text-text mb-1">{insights.savingsRate}%</h3>
          <p className="text-sm text-textMuted">Of total income saved</p>
        </div>
        
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-4">
            <CalendarDays size={24} />
          </div>
          <p className="text-textMuted text-sm font-medium mb-1">Monthly Comparison (Spend)</p>
          <h3 className="text-xl font-bold text-text mb-1">{formatCurrency(insights.thisMonthSpend)}</h3>
          <div className={cn(
            "flex items-center text-sm font-medium w-fit",
            insights.monthCompareValue > 0 ? "text-danger" : insights.monthCompareValue < 0 ? "text-success" : "text-textMuted"
          )}>
            {insights.monthCompareValue > 0 ? <ArrowUpRight size={16} className="mr-1" /> : insights.monthCompareValue < 0 ? <ArrowDownRight size={16} className="mr-1" /> : null}
            {insights.monthCompareText}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 flex flex-col justify-between border-primary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <TrendingUp size={120} />
        </div>
        <div className="relative z-10">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={24} />
          </div>
          <p className="text-lg font-semibold text-text mb-2">Observation</p>
          <p className="text-textMuted">
            Your overall net balance is <strong className="text-text">{formatCurrency(insights.netBalance)}</strong>. 
            {insights.netBalance > 0 
              ? " You're in the green! Keep up the good work and consider investing the surplus."
              : " You're spending more than you earn. Take a closer look at your top expense categories to find savings."}
          </p>
        </div>
      </div>

      <div className="glass-card p-8 bg-gradient-to-br from-surface to-surface2 border-border/50">
        <h3 className="text-lg font-semibold text-text mb-6">Financial Summary</h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-textMuted">Income Utilization</span>
              <span className="text-sm font-medium text-text">
                {insights.totalIncome > 0 ? ((insights.totalExpense / insights.totalIncome) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="w-full bg-surface2 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min((insights.totalExpense / Math.max(insights.totalIncome, 1)) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
