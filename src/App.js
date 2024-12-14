import React, { useState, useEffect } from 'react';
import api from './services/api';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TransactionPage from './pages/TransactionPage';
import HelpPage from './pages/HelpPage';
import Leaderboard from './pages/Leaderboard';
import SavingsPage from './pages/Savings';
import FriendsPage from './pages/FriendsPage';
import './App.css';

function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        budget: 0,
        balance: 0,
        transactions: [],
        _id: null,
        friends: [],
        pendingFriendRequests: []
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
                transactions: response.transactions || [],
                friends: [],
                pendingFriendRequests: []
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
            _id: null,
            friends: [],
            pendingFriendRequests: []
        });
    };

    const handleUpdateSavingsGoal = async (newGoal) => {
        try {
            const response = await fetch('http://localhost:5001/api/users/savings/goal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData._id,
                    newGoal
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            updateUserDataAndStorage({
                ...userData,
                savingsGoal: data.savingsGoal
            });
        } catch (error) {
            throw new Error('Failed to update savings goal');
        }
    };

    const handleAddToSavings = async (amount) => {
        try {
            const response = await fetch('http://localhost:5001/api/users/savings/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData._id,
                    amount
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            updateUserDataAndStorage({
                ...userData,
                balance: data.balance,
                currentSavings: data.currentSavings,
                transactions: [data.transaction, ...userData.transactions]
            });
        } catch (error) {
            throw new Error('Failed to add to savings');
        }
    };

    const handleWithdrawFromSavings = async (amount) => {
        try {
            const response = await fetch('http://localhost:5001/api/users/savings/withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData._id,
                    amount
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            updateUserDataAndStorage({
                ...userData,
                balance: data.balance,
                currentSavings: data.currentSavings,
                transactions: [data.transaction, ...userData.transactions]
            });
        } catch (error) {
            throw new Error('Failed to withdraw from savings');
        }
    };

    // Friends functionality
    const handleSendFriendRequest = async (friendUsername) => {
        try {
            const response = await fetch('http://localhost:5001/api/friends/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData._id,
                    friendUsername
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } catch (error) {
            throw new Error('Failed to send friend request');
        }
    };

    const handleAcceptFriendRequest = async (requestId) => {
        try {
           
            const updatedPendingRequests = userData.pendingFriendRequests.filter(
                request => request._id !== requestId
            );
            
           
            updateUserDataAndStorage({
                ...userData,
                pendingFriendRequests: updatedPendingRequests
            });
    
            const response = await fetch('http://localhost:5001/api/friends/accept', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData._id,
                    requestId
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
    
            // Finally, update friends list
            await fetchFriendsList();
            return data;
        } catch (error) {
            throw new Error('Failed to accept friend request');
        }
    };
    

    const handleRejectFriendRequest = async (requestId) => {
        try {
            const response = await fetch('http://localhost:5001/api/friends/reject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData._id,
                    requestId
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } catch (error) {
            throw new Error('Failed to reject friend request');
        }
    };

    const fetchFriendsList = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/friends/list/${userData._id}`);
            const data = await response.json();
            if (!response.ok) throw new Error('Failed to fetch friends');
            
            updateUserDataAndStorage({
                ...userData,
                friends: data
            });
        } catch (error) {
            console.error('Failed to fetch friends:', error);
        }
    };

    const fetchPendingFriendRequests = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/friends/pending/${userData._id}`);
            const data = await response.json();
            if (!response.ok) throw new Error('Failed to fetch pending requests');
            
            updateUserDataAndStorage({
                ...userData,
                pendingFriendRequests: data
            });
        } catch (error) {
            console.error('Failed to fetch pending requests:', error);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (isLoggedIn && userData._id) {
            fetchFriendsList();
            fetchPendingFriendRequests();
        }
    }, [isLoggedIn]);

    const renderPage = () => {
        const pages = {
            login: <Login onLogin={handleLogin} />,
            leaderboard: <Leaderboard />,
            dashboard: (
                <Dashboard
                    userData={userData}
                />
            ),
            savings: (
                <SavingsPage
                    userData={userData}
                    onUpdateSavingsGoal={handleUpdateSavingsGoal}
                    onAddToSavings={handleAddToSavings}
                    onWithdrawFromSavings={handleWithdrawFromSavings}
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
            help: <HelpPage />,
            friends: (
                <FriendsPage
                    userData={userData}
                    onSendRequest={handleSendFriendRequest}
                    onAcceptRequest={handleAcceptFriendRequest}
                    onRejectRequest={handleRejectFriendRequest}
                    onRefreshFriends={fetchFriendsList}
                    onRefreshPending={fetchPendingFriendRequests}
                />
            )
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