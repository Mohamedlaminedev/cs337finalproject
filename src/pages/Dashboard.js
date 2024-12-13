import React, { useState, useEffect } from 'react';
import BalanceDisplay from '../components/BalanceDisplay';
import SpendingChart from '../components/SpendingChart';
import TransactionList from '../components/TransactionList';
import '../styles/Dashboard.css';

function Dashboard({ userData }) {
    const [viewMode, setViewMode] = useState('none');
    const [displayTransactions, setDisplayTransactions] = useState([]);
    const { balance, transactions = [] } = userData;

    // Update displayTransactions whenever transactions change
    useEffect(() => {
        if (transactions.length > 0) {
            const sorted = [...transactions].sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            );
            setDisplayTransactions(sorted);
        }
    }, [transactions]);

    // Restore view mode from localStorage
    useEffect(() => {
        const savedViewMode = localStorage.getItem('dashboardViewMode');
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);

    const handleViewRecent = () => {
        const newMode = viewMode === 'recent' ? 'none' : 'recent';
        setViewMode(newMode);
        localStorage.setItem('dashboardViewMode', newMode);
    };

    const handleViewAll = () => {
        const newMode = viewMode === 'all' ? 'none' : 'all';
        setViewMode(newMode);
        localStorage.setItem('dashboardViewMode', newMode);
    };

    const getVisibleTransactions = () => {
        if (viewMode === 'all') {
            return displayTransactions; // Show all transactions
        }
        if (viewMode === 'recent') {
            return displayTransactions.slice(0, 3); // Show only the 3 most recent
        }
        return []; // Default to no transactions
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome{userData.username ? `, ${userData.username}` : ''}!</h1>
                <div className="transaction-buttons">
                    <button
                        className={`view-recent-btn ${viewMode === 'recent' ? 'active' : ''}`}
                        onClick={handleViewRecent}
                    >
                        Recent Transactions ({Math.min(3, displayTransactions.length)})
                    </button>
                    <button
                        className={`view-all-btn ${viewMode === 'all' ? 'active' : ''}`}
                        onClick={handleViewAll}
                    >
                        View All Transactions ({displayTransactions.length})
                    </button>
                </div>
            </div>

            <div className="dashboard-grid">
                <BalanceDisplay balance={balance} />
                <SpendingChart transactions={displayTransactions} /> {/* Always show all transactions */}
                {viewMode !== 'none' && (
                    <TransactionList
                        transactions={getVisibleTransactions()}
                        _id={userData._id}  /* Conditional display based on view mode */
                    />
                )}
            </div>
        </div>
    );
}

export default Dashboard;
