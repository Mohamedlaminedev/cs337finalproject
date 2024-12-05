import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [budget, setBudget] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const validateForm = () => {
        if (username.trim() === '') {
            setError('Username is required');
            return false;
        }
        if (!isLogin && (budget <= 0 || budget === '')) {
            setError('Please enter a valid budget amount');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setMessage('');
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setMessage('Success!');
            navigate('/dashboard');
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <h1>Welcome to Budget Tracker</h1>
                <p className="welcome-text">
                    {isLogin ? 'Welcome Back!' : 'Start Your Budget Journey'}
                </p>
                
                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div>
                    <input 
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    </div>
                    <div>
                    {!isLogin && (
                        <input 
                            type="number"
                            placeholder="Initial Budget"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                        />
                    )}
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <p className="toggle-form">
                    {isLogin ? "New to Budget Tracker? " : "Already tracking? "}
                    <span onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setMessage('');
                    }}>
                        {isLogin ? 'Sign Up' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;
