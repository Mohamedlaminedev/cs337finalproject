// SavingsProgress.js
import React from 'react';
import '../styles/SavingsProgress.css';

const SavingsProgress = ({ currentSavings = 0, savingsGoal = 0 }) => {
    const progress = savingsGoal > 0 ? Math.min((currentSavings / savingsGoal) * 100, 100) : 0;
    const isGoalReached = progress >= 100;

    return (
        <div className="progress-container">
            {isGoalReached ? (
                <div className="success-message">
                    <span className="success-text">
                        Congratulations! You've reached your savings goal! 🎉
                    </span>
                </div>
            ) : savingsGoal > 0 ? (
                <div className="progress-message">
                    <span className="progress-text">
                        {`${progress.toFixed(1)}% to your goal`}
                    </span>
                </div>
            ) : null}

            <div className="progress-wrapper">
                <div className="stats-container">
                    <div className="stat-box">
                        Current: ${currentSavings.toFixed(2)}
                    </div>
                    <div className="stat-box">
                        Goal: ${savingsGoal.toFixed(2)}
                    </div>
                </div>

                <div className="progress-bar-container">
                    <div
                        className="progress-bar"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: isGoalReached ? '#10B981' : '#3B82F6'
                        }}
                    >
                        <span className="progress-text-small">
                            {progress > 10 ? `${progress.toFixed(1)}%` : ''}
                        </span>
                    </div>
                </div>

                <div className="milestones-grid">
                    {[25, 50, 75, 100].map((milestone) => (
                        <div
                            key={milestone}
                            className={`milestone ${
                                progress >= milestone
                                    ? 'milestone-complete'
                                    : 'milestone-incomplete'
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