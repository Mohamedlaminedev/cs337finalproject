import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingChart = ({ transactions = [] }) => {
    const { data, hasTransactions, totalSpending } = useMemo(() => {
        // Guard clause for when transactions is undefined or empty
        if (!transactions || transactions.length === 0) {
            return {
                data: {
                    labels: ['No transactions yet'],
                    datasets: [{ data: [100], backgroundColor: ['#e5e7eb'] }]
                },
                hasTransactions: false,
                totalSpending: 0
            };
        }

        const categoryTotals = {};
        let totalSpending = 0;

        // Include both debit (expenses) and transfer transactions
        transactions.forEach(transaction => {
            if (transaction.type === 'debit' || transaction.type === 'transfer') {
                const category = transaction.category.toLowerCase().trim();

                if (!categoryTotals[category]) {
                    categoryTotals[category] = 0;
                }
                categoryTotals[category] += transaction.amount;
                totalSpending += transaction.amount;
            }
        });

        // If no expenses or transfers found
        if (totalSpending === 0) {
            return {
                data: {
                    labels: ['No expenses yet'],
                    datasets: [{ data: [100], backgroundColor: ['#e5e7eb'] }]
                },
                hasTransactions: false,
                totalSpending: 0
            };
        }

        // Prepare chart data
        const categories = Object.keys(categoryTotals);
        const data = {
            labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
            datasets: [
                {
                    data: categories.map(category =>
                        ((categoryTotals[category] / totalSpending) * 100).toFixed(1)
                    ),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', 
                        '#4BC0C0', '#9966FF', '#FF9F40', 
                        '#8884D8'
                    ]
                }
            ]
        };

        return { data, hasTransactions: true, totalSpending };
    }, [transactions]);

    return (
        <div className="spending-chart">
            <h2>Spending Breakdown</h2>
            {hasTransactions ? (
                <>
                    <Pie data={data} />
                    <p>Total Expenses: ${totalSpending.toFixed(2)}</p>
                </>
            ) : (
                <div className="no-transactions">
                    No spending recorded yet.
                    <p>Add transactions to see your spending breakdown!</p>
                </div>
            )}
        </div>
    );
};

export default SpendingChart;
