import React, { useState, useEffect } from 'react';
import api from './services/api';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TransactionPage from './pages/TransactionPage';
import HelpPage from './pages/HelpPage';
import Leaderboard from './pages/Leaderboard';
import './App.css';

function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        budget: 0,
        balance: 0,
        transactions: [],
        _id: null
    });

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
            setIsLoggedIn(true);
            setCurrentPage('dashboard');
        }
    }, []);

    const updateUserDataAndStorage = (newData) => {
        const updatedData = {
            ...newData,
            transactions: newData.transactions || []
        };
        localStorage.setItem('userData', JSON.stringify(updatedData));
        setUserData(updatedData);
    };

    const handleLogin = async (username, initialBalance, isSignup) => {
        try {
            const response = isSignup 
                ? await api.signup(username, initialBalance)
                : await api.login(username);

            if (!response._id) {
                throw new Error('Invalid response from server');
            }
           
            const newUserData = {
                _id: response._id,
                username: response.username,
                budget: response.budget,
                balance: response.balance,
                transactions: response.transactions || []
            };

            updateUserDataAndStorage(newUserData);
            setIsLoggedIn(true);
            setCurrentPage('dashboard');
            
            return response;
        } catch (error) {
            throw new Error('Username not found');
        }
    };

    const handleAddTransaction = async (transaction) => {
        const userId = userData._id;
        if (!userId) throw new Error('User ID not found');

        try {
            const response = await api.addTransaction(userId, {
                ...transaction,
                amount: Number(transaction.amount),
                userId: userId,
                incomeSource: transaction.incomeSource
            });

            const updatedUserData = {
                ...userData,
                balance: response.balance,
                transactions: response.transactions || []
            };

            updateUserDataAndStorage(updatedUserData);
            return response;
        } catch (error) {
            console.error('Transaction failed:', error);
            throw error;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userData');
        setIsLoggedIn(false);
        setCurrentPage('login');
        localStorage.removeItem('dashboardViewMode'); 
        setUserData({
            username: '',
            budget: 0,
            balance: 0,
            transactions: [],
            _id: null
        });
    };

    const renderPage = () => {
        const pages = {
            login: <Login onLogin={handleLogin} />,
            leaderboard: <Leaderboard />,
            dashboard: (
                <Dashboard
                    userData={{
                        ...userData,
                        spendingData: userData.transactions
                            .filter(t => t.type === 'debit')
                            .reduce((acc, t) => {
                                acc[t.category] = (acc[t.category] || 0) + t.amount;
                                return acc;
                            }, {})
                    }}
                />
            ),
            transactions: (
                <TransactionPage
                    transactions={userData.transactions}
                    onAddTransaction={handleAddTransaction}
                    currentBalance={userData.balance}
                    userData={userData}
                />
            ),
            help: <HelpPage />
        };

        return pages[currentPage] || pages.login;
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
