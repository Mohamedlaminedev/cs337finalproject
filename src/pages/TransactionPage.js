import React, { useState } from 'react';
import '../styles/TransactionPage.css';

function TransactionPage({ transactions = [], onAddTransaction, currentBalance = 0 }) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('expense');
    const [incomeSource, setIncomeSource] = useState('');
    const [error, setError] = useState('');

    const categories = [
        'food',
        'rent',
        'utilities',
        'entertainment',
        'transportation',
        'other'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (type === 'expense' && parseFloat(amount) > currentBalance) {
            setError('Insufficient funds');
            return;
        }
    
        try {
            const newTransaction = {
                type: type === 'expense' ? 'debit' : 'credit',
                category: type === 'expense' ? category : 'income',
                amount: parseFloat(amount),
                description: type === 'income' ? incomeSource : '',
                incomeSource: type === 'income' ? incomeSource : '',
                date: new Date().toISOString()
            };
    
            console.log('Submitting transaction:', newTransaction);
            await onAddTransaction(newTransaction);
            
            setAmount('');
            setCategory('');
            setType('expense');
            setIncomeSource('');
            setError('');
        } catch (error) {
            setError('Transaction failed. Please try again.');
        }
    };
    

    return (
        <div className="transaction-page">
            <h2>Add Transaction</h2>
            <div className="balance-info">
                Current Balance: <span className={(currentBalance || 0) <= 0 ? 'negative-balance' : 'positive-balance'}>
                    ${(currentBalance || 0).toFixed(2)}
                </span>
            </div>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <select 
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        setError('');
                        if (e.target.value === 'income') {
                            setCategory('income');
                        } else {
                            setCategory('');
                        }
                    }}
                    className="transaction-input"
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>

                {type === 'income' && (
                    <input
                        type="text"
                        value={incomeSource}
                        onChange={(e) => setIncomeSource(e.target.value)}
                        placeholder="Income Source (e.g., Salary, Freelance)"
                        className="transaction-input"
                        required
                    />
                )}
                
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
                
                {type === 'expense' && (
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="transaction-input"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                )}

                <button type="submit">Add Transaction</button>
            </form>

            <div className="transactions-list">
                <h3>Recent Transactions</h3>
                {transactions.length === 0 ? (
                    <p>No transactions yet</p>
                ) : (
                    <ul>
                        {transactions.map(transaction => (
                            <li key={transaction.id || transaction._id} className={`transaction-item ${transaction.type}`}>
                                <div className="transaction-info">
                                    <span className="transaction-category">
                                        {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                                    </span>
                                    {transaction.type === 'credit' && transaction.description && (
                                        <span className="income-source">
                                            ({transaction.description})
                                        </span>
                                    )}
                                    <span className="transaction-date">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="transaction-amount">
                                    {transaction.type === 'debit' ? '-' : '+'}
                                    ${Number(transaction.amount).toFixed(2)}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default TransactionPage;
