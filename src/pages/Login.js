import React, { useState } from 'react';
import '../styles/Login.css';

function Login({ onLogin }) {
    const [isSignup, setIsSignup] = useState(false);
    const [username, setUsername] = useState('');
    const [initialBalance, setInitialBalance] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (!username.trim()) {
                throw new Error('Username is required');
            }

            if (isSignup && (!initialBalance || Number(initialBalance) <= 0)) {
                throw new Error('Please enter a valid initial balance');
            }

            await onLogin(username, initialBalance, isSignup);
        } catch (error) {
            setError(error.message);
            console.error('Login/Signup error:', error);
        }
    };

    const toggleMode = () => {
        setIsSignup(!isSignup);
        setError('');
        setUsername('');
        setInitialBalance('');
    };

    return (
        <div className="login-container">
            <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={handleSubmit} noValidate>
                {error && <div className="error">{error}</div>}
                
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                
                {isSignup && (
                    <input
                        type="number"
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(e.target.value)}
                        placeholder="Initial Balance"
                        min="0"
                        step="0.01"
                        required
                    />
                )}
                
                <button type="submit">
                    {isSignup ? 'Sign Up' : 'Login'}
                </button>

                <p onClick={toggleMode}>
                    {isSignup ? 'Already have an account? Login' : 'New user? Sign up'}
                </p>
            </form>
        </div>
    );
}

export default Login;
