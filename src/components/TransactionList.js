import React from 'react';
import '../styles/TransactionPage.css';

function TransactionList({ transactions = [], _id }) {
    // Dynamic title based on the number of transactions
    const getTitle = () => {
        if (transactions.length === 0) return 'Transactions';
        if (transactions.length <= 3) return 'Recent Transactions';
        return 'All Transactions';
    };

    // Helper function to capitalize the first letter
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const getAmountSign = (transaction) => {
        if (transaction.type === 'income') {
            return '+';
        } else if (transaction.type === 'debit') {
            return '-';
        } else if (transaction.type === 'transfer') {
            console.log(String(transaction.recipient));
            console.log(String(_id));
            return String(transaction.recipient) === String(_id) ? '+' : '-';
        }
        return '';
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
                                {/* Display Category */}
                                <span className="transaction-category">
                                    {transaction.type === 'transfer'
                                        ? `${capitalize(transaction.category)} - Transfer`
                                        : capitalize(transaction.category)}
                                </span>

                                {/* Display Date */}
                                <span className="transaction-date">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Display Amount */}
                            <div className={`transaction-amount ${transaction.type}`}>
                                {getAmountSign(transaction)} ${Number(transaction.amount).toFixed(2)}
                            </div>
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
