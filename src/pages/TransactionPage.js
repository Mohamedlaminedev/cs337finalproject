// TransactionPage.js
import React, { useState } from 'react';
import '../styles/TransactionPage.css';

function TransactionPage({ transactions, onAddTransaction, currentBalance }) {  // Add currentBalance prop
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('expense');
    const [error, setError] = useState('');  // Add error state

    const categories = [
        'Food',
        'Rent',
        'Utilities',
        'Entertainment',
        'Transportation',
        'Other'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (type === 'expense' && parseFloat(amount) > currentBalance) {
            setError('Insufficient funds');
            return;
        }

        try {
            const newTransaction = {
                type,
                category,
                amount: parseFloat(amount),
                date: new Date().toISOString()
            };

            await onAddTransaction(newTransaction);
            setAmount('');
            setCategory('');
            setError('');
        } catch (error) {
            setError('Failed to add transaction');
        }
    };

    return (
        <div className="transaction-page">
            <h2>Add Transaction</h2>
            <div className="balance-info">
                Current Balance: <span className={currentBalance <= 0 ? 'negative-balance' : 'positive-balance'}>
                    ${currentBalance.toFixed(2)}
                </span>
            </div>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <select 
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        setError(''); // Clear error when switching types
                    }}
                    className="transaction-input"
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
                
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    className="transaction-input"
                    min="0.01"
                    step="0.01"
                    required
                />
                
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="transaction-input"
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <button type="submit">Add Transaction</button>
            </form>

            {/* Rest of your transactions list code */}
        </div>
    );
}

export default TransactionPage;