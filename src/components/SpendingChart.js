import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function SpendingChart() {
    const data = {
        labels: ['Food', 'Rent', 'Entertainment', 'Utilities', 'Other'],
        datasets: [{
            data: [300, 800, 200, 400, 100],
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF'
            ]
        }]
    };

    return (
        <div className="chart-container">
            <h2>Spending Breakdown</h2>
            <Pie data={data} />
        </div>
    );
}

export default SpendingChart;
