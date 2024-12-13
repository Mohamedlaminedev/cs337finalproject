import React, { useState } from 'react';
import '../styles/TransactionPage.css';

function TransactionPage({ transactions = [], onAddTransaction, currentBalance = 0, userData}) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('expense');
    const [recipientUsername, setRecipientUsername] = useState('');
    const [error, setError] = useState('');

    const categories = [
        'food',
        'rent',
        'utilities',
        'entertainment',
        'transportation',
        'other'
    ];

    const getAmountSign = (transaction) => {
        if (transaction.type === 'income') {
            return '+';
        } else if (transaction.type === 'debit') {
            return '-';
        } else if (transaction.type === 'transfer') {
            return String(transaction.recipient) === String(userData._id) ? '+' : '-';
        }
        return ''; 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate sufficient funds for expense and transfer
        if ((type === 'expense' || type === 'transfer') && parseFloat(amount) > currentBalance) {
            setError('Insufficient funds');
            return;
        }

        try {
            const newTransaction = {
                type: type === 'expense' ? 'debit' : type,
                category: type === 'income' ? 'income' : category, // Ensure category is set for transfer and expense
                amount: parseFloat(amount),
                recipientUsername: type === 'transfer' ? recipientUsername : null,
                date: new Date().toISOString(),
            };

            console.log('Submitting transaction:', newTransaction);
            await onAddTransaction(newTransaction);

            // Reset the form
            setAmount('');
            setCategory('');
            setType('expense');
            setRecipientUsername('');
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
                        setCategory(''); // Reset category when type changes
                    }}
                    className="transaction-input"
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                    <option value="transfer">Transfer</option>
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

                {/* Category dropdown for Expense and Transfer */}
                {(type === 'expense' || type === 'transfer') && (
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

                {/* Recipient Username input for Transfer */}
                {type === 'transfer' && (
                    <input
                        type="text"
                        value={recipientUsername}
                        onChange={(e) => setRecipientUsername(e.target.value)}
                        placeholder="Recipient Username"
                        className="transaction-input"
                        required
                    />
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
                                        {transaction.type === 'transfer'
                                            ? `${transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)} - Transfer`
                                            : transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                                    </span>
                                    <span className="transaction-date">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className={`transaction-amount ${transaction.type}`}>
                                    {getAmountSign(transaction)} ${Number(transaction.amount).toFixed(2)}
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
