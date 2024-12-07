// Login.js
import React, { useState } from 'react';
import '../styles/Login.css';


function Login({ onLogin }) {
    const [isSignup, setIsSignup] = useState(false);
    const [username, setUsername] = useState('');
    const [initialBalance, setInitialBalance] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!username.trim()) {
            setError('Username is required');
            return;
        }

        if (isSignup && (!initialBalance || initialBalance <= 0)) {
            setError('Please enter a valid initial balance');
            return;
        }

        try {
            await onLogin(username, parseFloat(initialBalance), isSignup);
        } catch (error) {
            setError(error.message);
        }
    };




    return (
        <div className="login-container">
            <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
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
                        required
                    />
                )}
                
                <button type="submit">
                    {isSignup ? 'Sign Up' : 'Login'}
                </button>

                <p onClick={() => {
                    setIsSignup(!isSignup);
                    setError(''); // Clear any errors when switching modes
                    setUsername(''); // Clear fields when switching modes
                    setInitialBalance('');
                }}>
                    {isSignup ? 'Already have an account? Login' : 'New user? Sign up'}
                </p>
            </form>
        </div>
    );
}

export default Login;