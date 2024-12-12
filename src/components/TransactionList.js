import React from 'react';
import '../styles/TransactionPage.css';

function TransactionList({ transactions = [] }) {
    const getTitle = () => {
        if (transactions.length === 0) return 'Transactions';
        if (transactions.length <= 3) return 'Recent Transactions';
        return 'All Transactions';
    };

    return (
        <div className="transaction-list">
            <h2>{getTitle()}</h2>
            {transactions.length > 0 ? (
                <div className="transactions-container">
                    {transactions.map(transaction => (
                        <div 
                            key={transaction._id || transaction.id} 
                            className={`transaction-item ${transaction.type}`}
                        >
                            <div className="transaction-info">
                                <span className="transaction-category">
                                    {transaction.category.charAt(0).toUpperCase() + 
                                     transaction.category.slice(1)}
                                </span>
                                {transaction.type === 'credit' && transaction.incomeSource && (
                                    <span className="income-source">
                                        ({transaction.incomeSource})
                                    </span>
                                )}
                                <span className="transaction-date">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </span>
                            </div>
                            <span className={`transaction-amount ${transaction.type}`}>
                                {transaction.type === 'debit' ? '-' : '+'}
                                ${Number(transaction.amount).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-transactions">
                    <p>No transactions to display</p>
                </div>
            )}
        </div>
    );
}

export default TransactionList;
