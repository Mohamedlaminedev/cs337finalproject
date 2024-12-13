// src/components/Savings.js

import React, { useState } from 'react';
import SavingsProgress from "./SavingsProgress";

const Savings = ({
                     balance = 0,
                     currentSavings = 0,
                     savingsGoal = 0,
                     onUpdateSavingsGoal,
                     onAddToSavings,
                     onWithdrawFromSavings
                 }) => {
    const [showGoalInput, setShowGoalInput] = useState(false);
    const [newGoal, setNewGoal] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [error, setError] = useState('');

    const progress = savingsGoal > 0 ? Math.min((currentSavings / savingsGoal) * 100, 100) : 0;

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

        if (type === 'add' && amount > balance) {
            setError('Insufficient balance');
            return;
        }

        if (type === 'withdraw' && amount > currentSavings) {
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
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Savings Progress</h2>
                <button
                    onClick={() => setShowGoalInput(!showGoalInput)}
                    className="bg-blue-500 text-white px-3 py-1.5 text-sm rounded hover:bg-blue-600 transition-colors"
                >
                    {savingsGoal ? 'Update Goal' : 'Set Goal'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {showGoalInput ? (
                <form onSubmit={handleGoalSubmit} className="mb-6">
                    <input
                        type="number"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Enter savings goal"
                        className="w-full p-2 border rounded mb-2"
                        min="0"
                        step="0.01"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-3 py-1.5 text-sm rounded hover:bg-green-600"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowGoalInput(false);
                                setError('');
                            }}
                            className="bg-gray-500 text-white px-3 py-1.5 text-sm rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <SavingsProgress currentSavings={currentSavings} savingsGoal={savingsGoal} />
            )}

            <div className="mt-8">
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <input
                            type="number"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full p-2 border rounded"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <button
                        onClick={() => handleTransfer('add')}
                        className="bg-blue-500 text-white px-3 py-1.5 text-sm rounded hover:bg-blue-600"
                    >
                        Add to Savings
                    </button>
                    <button
                        onClick={() => handleTransfer('withdraw')}
                        className="bg-orange-500 text-white px-3 py-1.5 text-sm rounded hover:bg-orange-600"
                    >
                        Withdraw
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Savings;