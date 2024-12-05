import React, { useState } from 'react';
import '../styles/TransactionPage.css';

function TransactionPage() {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('expense');
    const [transactions, setTransactions] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newTransaction = {
            id: Date.now(),
            type,
            category,
            amount: parseFloat(amount),
            date: new Date().toISOString()
        };

        setTransactions([newTransaction, ...transactions]);
        
        // Reset form
        setAmount('');
        setCategory('');
        setType('expense');
    };

    return (
        <div className="transaction-page">
            <h2>New Transaction</h2>
            <form onSubmit={handleSubmit}>
                <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
                
                <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Select Category</option>
                    <option value="food">Food</option>
                    <option value="rent">Rent</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="utilities">Utilities</option>
                    <option value="other">Other</option>
                </select>

                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    required
                />

                <button type="submit">Add Transaction</button>
            </form>

            <div className="transactions-list">
                <h3>Recent Transactions</h3>
                {transactions.map(transaction => (
                    <div key={transaction.id} className="transaction-item">
                        <span className={`type ${transaction.type}`}>
                            {transaction.type}
                        </span>
                        <span className="category">{transaction.category}</span>
                        <span className="amount">
                            ${transaction.amount}
                        </span>
                        <span className="date">
                            {new Date(transaction.date).toLocaleDateString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TransactionPage;
