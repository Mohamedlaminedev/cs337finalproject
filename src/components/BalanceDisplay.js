// BalanceDisplay.js
import React from 'react';

function BalanceDisplay({ balance }) {
    return (
        <div className="balance-card">
            <h2>Current Balance</h2>
            <div className="balance-amount">
                ${balance.toFixed(2)} {/* Format to 2 decimal places */}
            </div>
        </div>
    );
}

export default BalanceDisplay

