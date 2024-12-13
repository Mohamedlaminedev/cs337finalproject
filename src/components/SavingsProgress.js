// src/components/SavingsProgress.js
import React from 'react';

const SavingsProgress = ({ currentSavings = 0, savingsGoal = 0 }) => {
    const progress = savingsGoal > 0 ? Math.min((currentSavings / savingsGoal) * 100, 100) : 0;
    const isGoalReached = progress >= 100;

    return (
        <div className="w-full max-w-lg mx-auto mt-4">
            {isGoalReached ? (
                <div className="bg-green-100 p-4 rounded-lg mb-4 flex items-center gap-2">
                    <span className="text-green-700 font-medium">
                        Congratulations! You've reached your savings goal! 🎉
                    </span>
                </div>
            ) : savingsGoal > 0 ? (
                <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-center gap-2">
                    <span className="text-blue-700">
                        {`${progress.toFixed(1)}% to your goal`}
                    </span>
                </div>
            ) : null}

            <div className="relative pt-1">
                <div className="flex mb-4 items-center justify-between gap-8">
                    <div className="text-lg font-semibold text-gray-700 bg-gray-50 p-3 rounded-lg flex-1 text-center">
                        Current: ${currentSavings.toFixed(2)}
                    </div>
                    <div className="text-lg font-semibold text-gray-700 bg-gray-50 p-3 rounded-lg flex-1 text-center">
                        Goal: ${savingsGoal.toFixed(2)}
                    </div>
                </div>

                <div className="overflow-hidden h-6 relative rounded-full bg-gray-200">
                    <div
                        className="h-full transition-all duration-1000 ease-out rounded-full flex items-center justify-center"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: isGoalReached ? '#10B981' : '#3B82F6'
                        }}
                    >
                        <span className="text-white text-xs font-bold px-2">
                            {progress > 10 ? `${progress.toFixed(1)}%` : ''}
                        </span>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2">
                    {[25, 50, 75, 100].map((milestone) => (
                        <div
                            key={milestone}
                            className={`text-center p-2 rounded ${
                                progress >= milestone
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            {milestone}%
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SavingsProgress;