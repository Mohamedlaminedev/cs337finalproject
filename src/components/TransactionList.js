// TransactionList.js
import React from 'react';

function TransactionList({ transactions = [] }) {
    if (transactions.length === 0) {
        return (
            <div className="transaction-list">
                <h2>Recent Transactions</h2>
                <div className="no-transactions">
                    <p>No transactions yet</p>
                </div>
            </div>
        );
    }
    

    return (
        <div className="transaction-list">
            <h2>Recent Transactions</h2>
            {transactions.map(transaction => (
                <div 
                    key={transaction.id} 
                    className={`transaction-item ${transaction.type}`}
                >
                    <div className="transaction-info">
                        <span className="transaction-category">{transaction.category}</span>
                        <span className="transaction-date">
                            {new Date(transaction.date).toLocaleDateString()}
                        </span>
                    </div>
                    <span className={`transaction-amount ${transaction.type}`}>
                        {transaction.type === 'expense' ? '-' : '+'}$
                        {transaction.amount.toFixed(2)}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default TransactionList;