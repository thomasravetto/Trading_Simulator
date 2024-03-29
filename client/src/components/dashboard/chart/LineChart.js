import { useState } from 'react';
import Chart from  'chart.js/auto';
import { Line } from 'react-chartjs-2';

function LineChart ({ asset_prices }) {

    const charData = {
        labels: asset_prices,
        datasets: [
            {
                label: '',
                data: asset_prices,
                backgroundColor: function(context) {
                    const chart = context.chart;
                    const ctx = chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 450);
                    gradient.addColorStop(0, 'rgba(50, 205, 50, 0.4)');
                    gradient.addColorStop(0.35, 'rgba(50, 205, 50, 0)');
                    return gradient;
                },
                borderColor: "rgb(50, 205, 50)",
                borderWidth: 1,
                pointRadius: 0,
                fill: true,
            }
        ]
    };

    const options = {
        scales: {
            x: {
                display: false // Hide x-axis labels
            },
            y: {
                display: false // Hide y-axis labels
            }
        },
        plugins: {
            legend: {
                display: false
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };


    return (
        <div className='chart_container'>
            <Line data={charData} options={options}/>
        </div>
    )
}

export default LineChart;