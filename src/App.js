import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TransactionPage from './pages/TransactionPage';
import HelpPage from './pages/HelpPage';
import './App.css';
import './styles/Login.css';
import './styles/Navigation.css';
import './styles/Dashboard.css';
import './styles/TransactionPage.css';
import './styles/HelpPage.css';

function AppContent() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/';

    return (
        <div className="App">
            {!isLoginPage && <Navigation />}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<TransactionPage />} />
                <Route path="/help" element={<HelpPage />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
