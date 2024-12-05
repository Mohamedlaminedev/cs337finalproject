import React from 'react';

function TransactionList() {
    const transactions = [
        { id: 1, type: 'expense', category: 'Food', amount: 30 },
        { id: 2, type: 'income', category: 'Salary', amount: 1000 }
    ];

    return (
        <div className="transaction-list">
            <h2>Recent Transactions</h2>
            {transactions.map(transaction => (
                <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                    <span>{transaction.category}</span>
                    <span>${transaction.amount}</span>
                </div>
            ))}
        </div>
    );
}

export default TransactionList;
