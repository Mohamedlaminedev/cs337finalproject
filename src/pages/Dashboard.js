// Dashboard.js
import React from 'react';
import BalanceDisplay from '../components/BalanceDisplay';
import SpendingChart from '../components/SpendingChart';
import TransactionList from '../components/TransactionList';
import '../styles/Dashboard.css';

function Dashboard({ userData }) {
   
    const { balance, transactions = [] } = userData;

    return (
        <div className="dashboard-container">
            <h1>Welcome{userData.username ? `, ${userData.username}` : ''}!</h1>
            <div className="dashboard-grid">
                <BalanceDisplay balance={balance} />
                <SpendingChart transactions={transactions} />
                <TransactionList transactions={transactions} />
            </div>
        </div>
    );
}

export default Dashboard;