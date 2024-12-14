// navigation bar
import React from 'react';
import '../styles/Navigation.css';

export default function Navigation({ currentPage, onNavigate, onLogout }) {
    return (
        <nav className="navigation">
            <div className="navigation-container">
                <ul>
                    <li
                        onClick={() => onNavigate('dashboard')}
                        className={currentPage === 'dashboard' ? 'active' : ''}
                    >
                        Dashboard
                    </li>
                    <li
                        onClick={() => onNavigate('transactions')}
                        className={currentPage === 'transactions' ? 'active' : ''}
                    >
                        Transactions
                    </li>
                    <li
                        onClick={() => onNavigate('savings')}
                        className={currentPage === 'savings' ? 'active' : ''}
                    >
                        Savings
                    </li>
                    <li
                        onClick={() => onNavigate('friends')}
                        className={currentPage === 'friends' ? 'active' : ''}
                    >
                        Friends
                    </li>
                    <li
                        onClick={() => onNavigate('leaderboard')}
                        className={currentPage === 'leaderboard' ? 'active' : ''}
                    >
                        Leaderboard
                    </li>
                    <li
                        onClick={() => onNavigate('help')}
                        className={currentPage === 'help' ? 'active' : ''}
                    >
                        Help
                    </li>
                    <li
                        onClick={onLogout}
                        className="logout"
                    >
                        Logout
                    </li>
                </ul>
            </div>
        </nav>
    );
}