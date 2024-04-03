import { useEffect, useState } from 'react';
import PortfolioLineChart from '../chart/PorfolioLineChart';

function PortfolioItem (props) {
    const asset_info = props.asset;
    const [prices, setPrices] = useState();

    const API_URL = props.API_URL;

    async function fetchAssetPrices (asset_symbol) {
        const resp = await fetch(API_URL + '/market/load_asset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                asset_symbol: asset_symbol,
                timeframe: '15min',
                outputsize: 'compact'
            })
        });

        const data = await resp.json();

        if (data && data.prices) {
            const formattedData = formatAssetData(data);

            return formattedData;
    }

    function formatAssetData (data) {
        if (data && data.metadata && data.prices) {
            const assetPrices =  data.prices.map((price) => {
                return price[1]['4. close'];
            });

            return assetPrices;
        } else {
            return [];
        }
    }
}

    useEffect(() => {
        async function fetchData () {
            const assetPrices = await fetchAssetPrices(asset_info.asset_symbol);

            if (assetPrices && assetPrices.length > 0) {
                setPrices(assetPrices.reverse());
            } else {
                throw new Error('Error retrieving data')
            }
        }
        fetchData();
    }, [])

    return (
        <div className='portfolio_item'>
            <div className='portfolio_title_graph_container'>
                <div className='portfolio_item_title'>
                    <h1 className='portfolio_item_symbol'>{asset_info.asset_symbol}</h1>
                    <p className='portfolio_item_name'>{asset_info.asset_name}</p>
                </div>
                <div className='portfolio_graph_container'>
                    <PortfolioLineChart id='porfolio_chart' asset_prices={prices}/>
                </div>
            </div>
            <div className='portfolio_item_stats'>
                {prices && prices.length > 0 && (
                    <h1 className='portfolio_item_price'>{prices[prices.length - 1].slice(0, -2)}$</h1>
                )}
                <h3>You Own:</h3>
                {prices && prices.length > 0 && (
                    <div>
                        <p>{asset_info.quantity} Shares</p>
                        <p>{(prices[prices.length - 1] * asset_info.quantity).toFixed(2)}$</p>
                    </div>
                     )}
            </div>
        </div>
    )
}

export default PortfolioItem;