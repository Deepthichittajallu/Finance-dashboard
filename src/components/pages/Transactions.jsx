import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, cn } from '../../lib/utils';
import { Plus, Search, Filter, Trash2, Edit3, ArrowUpRight, ArrowDownRight, Download, ArrowDown, ArrowUp } from 'lucide-react';
import { format } from 'date-fns';

export const Transactions = () => {
  const { transactions, role, deleteTransaction, addTransaction, editTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  // Sort State added to handle "Sorting or search" prompt requirement explicitly
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const filteredAndSortedTransactions = useMemo(() => {
    let result = transactions.filter(t => {
      const matchSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'All' || t.type === filterType;
      return matchSearch && matchType;
    });

    result.sort((a, b) => {
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortConfig.key === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    return result;
  }, [transactions, searchTerm, filterType, sortConfig]);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const submittedData = {
      description: formData.get('description'),
      amount: Number(formData.get('amount')),
      category: formData.get('category'),
      type: formData.get('type'),
    };
    
    if (editingTransaction) {
      editTransaction({
        ...editingTransaction,
        ...submittedData,
      });
    } else {
      addTransaction({
        ...submittedData,
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      });
    }
    
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    if (filteredAndSortedTransactions.length === 0) return;

    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedTransactions.map(t => 
        `"${t.date}","${t.description}","${t.category}","${t.type}","${t.amount}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_export_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Transactions</h1>
          <p className="text-textMuted">View and manage your recent financial activity.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-surface2 hover:bg-border text-text px-4 py-2 rounded-lg font-medium transition-colors border border-border"
          >
            <Download size={18} />
            Export CSV
          </button>
        
          {role === 'Admin' && (
            <button 
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(139,92,246,0.2)]"
            >
              <Plus size={18} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="glass-card flex flex-col sm:flex-row gap-4 p-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={18} className="text-textMuted hidden sm:block" />
          <div className="flex bg-surface rounded-lg p-1 border border-border w-full sm:w-auto">
            {['All', 'Income', 'Expense'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                  filterType === type 
                    ? "bg-surface2 text-text shadow-sm" 
                    : "text-textMuted hover:text-text"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-x-auto w-full max-w-full">
        <div className="min-w-max">
          <table className="w-full text-left text-sm text-text">
            <thead className="bg-surface2/50 text-textMuted font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4">Category</th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:text-text transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortConfig.key === 'date' && (
                      sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-right cursor-pointer hover:text-text transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Amount
                    {sortConfig.key === 'amount' && (
                      sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
                {role === 'Admin' && <th className="px-6 py-4 w-24">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={role === 'Admin' ? 5 : 4} className="px-6 py-12 text-center text-textMuted">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-surface2/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                          t.type === 'Income' ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                        )}>
                          {t.type === 'Income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                        </div>
                        <span className="font-medium text-text break-words max-w-[200px] sm:max-w-xs">{t.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-surface2 rounded-full text-xs font-medium border border-border/50 inline-block">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-textMuted whitespace-nowrap">{t.date}</td>
                    <td className={cn(
                      "px-6 py-4 text-right font-bold whitespace-nowrap",
                      t.type === 'Income' ? "text-success" : "text-text"
                    )}>
                      {t.type === 'Income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    {role === 'Admin' && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenEditModal(t)}
                            className="p-1.5 text-textMuted hover:text-primary rounded-md hover:bg-primary/10 transition-colors"
                            title="Edit transaction"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteTransaction(t.id)}
                            className="p-1.5 text-textMuted hover:text-danger rounded-md hover:bg-danger/10 transition-colors"
                            title="Delete transaction"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-text">
                {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Description</label>
                <input 
                  required 
                  name="description" 
                  defaultValue={editingTransaction?.description || ''}
                  type="text" 
                  className="w-full bg-surface2 border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors" 
                  placeholder="e.g. Salary, Groceries" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-1">Amount</label>
                  <input 
                    required 
                    name="amount" 
                    defaultValue={editingTransaction?.amount || ''}
                    type="number" 
                    step="0.01" 
                    className="w-full bg-surface2 border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors" 
                    placeholder="0.00" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-1">Type</label>
                  <select 
                    required 
                    name="type" 
                    defaultValue={editingTransaction?.type || 'Expense'}
                    className="w-full bg-surface2 border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Category</label>
                <input 
                  required 
                  name="category" 
                  defaultValue={editingTransaction?.category || ''}
                  type="text" 
                  className="w-full bg-surface2 border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors" 
                  placeholder="e.g. Housing, Food, Entertainment" 
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 mt-6 border-t border-border">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-textMuted hover:text-text hover:bg-surface2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors"
                >
                  {editingTransaction ? 'Save Changes' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
