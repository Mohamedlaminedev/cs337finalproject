import React from 'react';
import BalanceDisplay from '../components/BalanceDisplay';
import SpendingChart from '../components/SpendingChart';
import TransactionList from '../components/TransactionList';
import '../styles/Dashboard.css';

function Dashboard() {
    return (
        <div className="dashboard-container">
            <h1>Welcome to Your Dashboard</h1>
            <div className="dashboard-grid">
                <BalanceDisplay />
                <SpendingChart />
                <TransactionList />
            </div>
        </div>
    );
}

export default Dashboard;
