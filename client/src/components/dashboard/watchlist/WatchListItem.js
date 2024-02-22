import LineChart from '../chart/LineChart';

function WatchListItem (props) {
    const asset_info = props.asset.metadata;
    const asset_prices = props.asset.prices.reverse();

    function calculate_percentage (first_val, last_val) {
        console.log(first_val, last_val)
        return String(((last_val - first_val) / first_val) * 100).slice(0, 4);
    }

    const percentage_from_yesterday = calculate_percentage(
        Number(asset_prices[0]),
        Number(asset_prices[asset_prices.length - 1])
    )

    return (
        <div className='watchlist_item'>
            <h1 className='watchlist_item_title'>{asset_info.symbol}</h1>
            <div className='watchlist_prices_graph_container'>
                <div className='watchlist_item_prices'>
                    <h2>{asset_prices[asset_prices.length - 1].slice(0, -2)}$</h2>
                    <div className="percentage_container">
                        {percentage_from_yesterday >= 0 ?
                        <p className='percentage positive'>+{percentage_from_yesterday}%</p> :
                        <p className='percentage negative'>{percentage_from_yesterday}%</p>}
                    </div>
                </div>
                <div className='watchlist_graph_container'>
                    <LineChart id='chart' asset_prices={asset_prices}/>
                </div>
            </div>
        </div>
    )
}

export default WatchListItem;