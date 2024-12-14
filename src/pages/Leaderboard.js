import React, { useState, useEffect } from 'react';
import api from '../services/api';
import trophyIcon from '../assets/trophy.jpeg'; // Ensure this path is correct
import '../styles/Leaderboard.css'


const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setIsLoading(true);
                const data = await api.getLeaderboard();
                setLeaderboard(data);
                setError(null);
            } catch (err) {
                console.error('Detailed leaderboard error:', err);
                setError('Failed to load leaderboard. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (isLoading) {
        return <div>Loading leaderboard...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="leaderboard-container card">
            <h2>Wealth Leaderboard</h2>
            {leaderboard.length === 0 ? (
                <p>No users found</p>
            ) : (
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((user, index) => (
                            <tr key={user._id || index}>
                                <td>
                                    {index === 0 && (
                                        <img 
                                            src={trophyIcon} 
                                            alt="Trophy" 
                                            style={{ width: '30px', marginRight: '10px' }}
                                        />
                                    )}
                                    {index + 1}
                                </td>
                                <td>{user.username}</td>
                                <td>${user.balance.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Leaderboard;