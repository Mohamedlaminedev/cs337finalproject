// SpendingChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingChart = ({ transactions = [] }) => {  // Add default empty array
    const calculateSpendingData = () => {
        // Guard clause for when transactions is undefined or empty
        if (!transactions || transactions.length === 0) {
            return {
                data: {
                    labels: ['No transactions yet'],
                    datasets: [{
                        data: [100],
                        backgroundColor: ['#e5e7eb']
                    }]
                },
                hasTransactions: false
            };
        }

        const categoryTotals = {};
        let totalSpending = 0;

        // Only count expenses
        transactions.forEach(transaction => {
            if (transaction.type === 'expense') {
                if (!categoryTotals[transaction.category]) {
                    categoryTotals[transaction.category] = 0;
                }
                categoryTotals[transaction.category] += transaction.amount;
                totalSpending += transaction.amount;
            }
        });

        // If no expenses found
        if (totalSpending === 0) {
            return {
                data: {
                    labels: ['No expenses yet'],
                    datasets: [{
                        data: [100],
                        backgroundColor: ['#e5e7eb']
                    }]
                },
                hasTransactions: false
            };
        }

        // Convert amounts to percentages
        const categories = Object.keys(categoryTotals);
        const data = {
            labels: categories,
            datasets: [{
                data: categories.map(category => 
                    ((categoryTotals[category] / totalSpending) * 100).toFixed(1)
                ),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ]
            }]
        };

        return { data, hasTransactions: true };
    };

    const { data, hasTransactions } = calculateSpendingData();

    return (
        <div className="chart-container">
            <h2>Spending Breakdown</h2>
            {hasTransactions ? (
                <Pie data={data} />
            ) : (
                <div className="no-spending-message">
                    <p>No spending recorded yet.</p>
                    <p>Add transactions to see your spending breakdown!</p>
                </div>
            )}
        </div>
    );
};

export default SpendingChart;