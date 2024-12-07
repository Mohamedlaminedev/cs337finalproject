import React, { useState } from 'react';
import { api } from './services/api';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TransactionPage from './pages/TransactionPage';
import HelpPage from './pages/HelpPage';
import './App.css';

function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        budget: 0,
        balance: 0,
        transactions: []
    });

    const handleLogin = async (username, initialBalance, isSignup) => {
        try {
            let response;
            if (isSignup) {
                response = await api.signup(username, initialBalance);
            } else {
                response = await api.login(username);
            }
            
            setUserData(response);
            setIsLoggedIn(true);
            setCurrentPage('dashboard');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleAddTransaction = async (transaction) => {
        try {
            const response = await api.addTransaction(userData.id, transaction);
            setUserData(response); // Update user data with new transaction
        } catch (error) {
            console.error('Failed to add transaction:', error);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentPage('login');
        setUserData({
            username: '',
            budget: 0,
            balance: 0,
            transactions: []
        });
    };

    const renderPage = () => {
        switch(currentPage) {
            case 'login':
                return <Login onLogin={handleLogin} />;
            case 'dashboard':
                return <Dashboard 
                    userData={{
                        ...userData,
                        spendingData: userData.transactions
                            .filter(t => t.type === 'expense')
                            .reduce((acc, t) => {
                                acc[t.category] = (acc[t.category] || 0) + t.amount;
                                return acc;
                            }, {})
                    }} 
                />;
            case 'transactions':
                return <TransactionPage 
                    transactions={userData.transactions}
                    onAddTransaction={handleAddTransaction}
                    currentBalance={userData.balance}
                />;
            case 'help':
                return <HelpPage />;
            default:
                return <Login onLogin={handleLogin} />;
        }
    };

    return (
        <div className="App">
            {isLoggedIn && (
                <Navigation 
                    currentPage={currentPage}
                    onNavigate={setCurrentPage}
                    onLogout={handleLogout}
                />
            )}
            {renderPage()}
        </div>
    );
}

export default App;