import React, { useState, useEffect } from 'react';
import { Trash2, DollarSign, TrendingUp, TrendingDown, Plus } from 'lucide-react';

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ name: '', amount: '', type: 'expense' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('expense-tracker-transactions');
    if (saved) {
      try { setTransactions(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expense-tracker-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const balance = transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Transaction name is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Please enter a valid amount';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const newTransaction = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      amount: Math.abs(parseFloat(formData.amount)),
      type: formData.type,
      date: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setFormData({ name: '', amount: '', type: 'expense' });
    setErrors({});
  };

  const deleteTransaction = (id) => setTransactions(prev => prev.filter(t => t.id !== id));
  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };
  const formatCurrency = (amt) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amt);
  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Expense Tracker</h1>
          <p className="text-gray-600">Manage your income and expenses</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Current Balance</h2>
            <div className={`text-4xl font-bold mb-4 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-600 font-medium">Income</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xl font-bold text-green-700">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-600 font-medium">Expenses</span>
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-xl font-bold text-red-700">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2" /> Add New Transaction
          </h3>
          <div className="space-y-4">
            <div>
              <input
                type="text" name="name" value={formData.name} onChange={handleInputChange}
                placeholder="e.g., Groceries, Salary" 
                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-300' : 'border-gray-300'} focus:ring-2`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number" name="amount" value={formData.amount} onChange={handleInputChange}
                  placeholder="0.00" className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.amount ? 'border-red-300' : 'border-gray-300'} focus:ring-2`}
                />
              </div>
              {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
            </div>

            <div>
              <select
                name="type" value={formData.type} onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <button
              type="button" onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
            >
              Add Transaction
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h3>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No transactions yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-800">{t.name}</h4>
                    <p className="text-sm text-gray-500">{formatDate(t.date)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{t.type}</p>
                    </div>
                    <button onClick={() => deleteTransaction(t.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
