import React from 'react';
import '../styles/Navigation.css';

function Navigation({ onNavigate, onLogout }) {
    return (
        <nav className="navigation">
            <ul>
                <li onClick={() => onNavigate('dashboard')}>Dashboard</li>
                <li onClick={() => onNavigate('transactions')}>Transactions</li>
                <li onClick={() => onNavigate('help')}>Help</li>
                <li onClick={onLogout}>Logout</li>
            </ul>
        </nav>
    );
}

export default Navigation;
