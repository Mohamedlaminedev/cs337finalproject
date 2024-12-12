import React from 'react';

const BalanceDisplay = ({ balance = 0 }) => {
    const formattedBalance = Number(balance).toFixed(2);
    
    return (
        <div className="balance-display">
            <h3>Current Balance</h3>
            <div className={`amount ${Number(formattedBalance) < 0 ? 'negative' : 'positive'}`}>
                ${formattedBalance}
            </div>
        </div>
    );
};

export default BalanceDisplay;
