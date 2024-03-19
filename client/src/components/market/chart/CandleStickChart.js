import { forwardRef, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const CandleStickChart = forwardRef((props, ref) => {

    const [series, setSeries] = useState([]);

    const [options, setOptions] = useState({
        chart: {
            type: "candlestick",
            height: 500,
            zoom: {
                enabled: true,
                type: 'xy',
                autoScaleYAxis: true,
            },
            toolbar: {
                show: true, // Hide toolbar
            },
            selection: {
                enabled: false, // Disable selection
            },
        },
        tooltip: {
            enabled: true,
            style: {
                fontSize: '2px',
            },
            x: {
                show: true,
                format: 'dd MMM',
            }
        },
        xaxis: {
            type: "category",
        },
        yaxis: {
            tooltip: {
                enabled: true,
            },

        },
    });

    useEffect(() => {
        function processData () {
            const seriesData = [
                {
                    data: props.prices.map((price) => {
                return {
                    x: String(price[0]),
                    y: [
                        Number(price[1]['1. open']),
                        Number(price[1]['2. high']),
                        Number(price[1]['3. low']),
                        Number(price[1]['4. close']),
                    ]
                }
            })}
        ];
    
            setSeries(seriesData);
        }

        if (props.prices.length > 0) {
            processData();
        }

    }, [props.prices]);

    return (
        <div className='candlestick_chart'>
            <Chart
            type='candlestick'
            height={500}
            options={options}
            series={series}
            ref={ref}
            />
        </div>
    )
});

export default CandleStickChart;