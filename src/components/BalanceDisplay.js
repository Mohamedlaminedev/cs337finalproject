import React from 'react';

function BalanceDisplay() {
    const balance = 1000; // This will later come from the backend

    return (
        <div className="balance-card">
            <h2>Current Balance</h2>
            <div className="balance-amount">${balance}</div>
        </div>
    );
}

export default BalanceDisplay;
