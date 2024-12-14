import React, { useState } from 'react';
import SavingsProgress from '../components/SavingsProgress';
import '../styles/SavingsPage.css';

function SavingsPage({
    userData,
    onUpdateSavingsGoal,
    onAddToSavings,
    onWithdrawFromSavings
}) {
    const [showGoalInput, setShowGoalInput] = useState(false);
    const [newGoal, setNewGoal] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [error, setError] = useState('');

    const handleGoalSubmit = async (e) => {
        e.preventDefault();
        if (!newGoal || isNaN(newGoal) || Number(newGoal) <= 0) {
            setError('Please enter a valid goal amount');
            return;
        }
        try {
            await onUpdateSavingsGoal(Number(newGoal));
            setShowGoalInput(false);
            setNewGoal('');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleTransfer = async (type) => {
        if (!transferAmount || isNaN(transferAmount) || Number(transferAmount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        const amount = Number(transferAmount);

        if (type === 'add' && amount > userData.balance) {
            setError('Insufficient balance');
            return;
        }

        if (type === 'withdraw' && amount > userData.currentSavings) {
            setError('Insufficient savings');
            return;
        }

        try {
            if (type === 'add') {
                await onAddToSavings(amount);
            } else {
                await onWithdrawFromSavings(amount);
            }
            setTransferAmount('');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="savings-page">
            <div className="page-header">
                <h2 className="page-title">Savings Progress</h2>
                <button
                    onClick={() => setShowGoalInput(!showGoalInput)}
                    className="goal-button"
                >
                    {userData.savingsGoal ? 'Update Goal' : 'Set Goal'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {showGoalInput ? (
                <form onSubmit={handleGoalSubmit} className="goal-form">
                    <input
                        type="number"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Enter savings goal"
                        className="goal-input"
                        min="0"
                        step="0.01"
                    />
                    <div className="button-group">
                        <button
                            type="submit"
                            className="save-button"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowGoalInput(false);
                                setError('');
                            }}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <SavingsProgress
                    currentSavings={userData.currentSavings}
                    savingsGoal={userData.savingsGoal}
                />
            )}

            <div className="transfer-section">
                <div className="transfer-controls">
                    <div className="transfer-input-wrapper">
                        <input
                            type="number"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="transfer-input"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <button
                        onClick={() => handleTransfer('add')}
                        className="add-button"
                    >
                        Add to Savings
                    </button>
                    <button
                        onClick={() => handleTransfer('withdraw')}
                        className="withdraw-button"
                    >
                        Withdraw
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SavingsPage;