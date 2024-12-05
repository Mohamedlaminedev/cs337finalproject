import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navigation.css';

function Navigation() {
    return (
        <nav className="main-nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/help">Help</Link>
        </nav>
    );
}

export default Navigation;
