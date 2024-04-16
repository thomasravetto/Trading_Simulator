import { useEffect, useState } from 'react';
import PortfolioLineChart from '../chart/PorfolioLineChart';

function PortfolioItem (props) {
    const userId = props.userId
    const asset_info = props.asset;
    const lastPrice = props.lastPrice || '';
    const [prices, setPrices] = useState();
    const [transactionsOpen, setTransactionsOpen] = useState(false);
    const [transactionsList, setTransactionsList] = useState([])

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


    async function handleTransactionsWindow (event) {
        event.stopPropagation();
        event.preventDefault();

        setTransactionsOpen(prevState => !prevState);

        if (!transactionsList.length) {
            const data = await loadTransactions(userId, asset_info.asset_symbol);
            setTransactionsList(data);
        }
    }

    async function loadTransactions (userId, asset_symbol) {
        try {
            const resp = await fetch(API_URL + '/portfolio/get_transactions_for_asset',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    user_id: userId,
                    asset_symbol: asset_symbol
                })
            });

            const data = await resp.json();

            return data;

        } catch (error) {
            throw new Error('Error retreiving transactions', error);
        }
    }

    function formatStringDate (dateString) {
        if (!dateString) {
            return;
        }
        let date = new Date(dateString);

        let day = date.getDate();
        let month = (date.getMonth() + 1);
        let year = date.getFullYear();

        if (day < 10) {
            day = '0' + day;
        }

        if (month < 10) {
            month = `0${month}`;
        }

        let formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
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
    }, []);

    return (
        <div className='portfolio_item_container'>
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
                        <h1 className='portfolio_item_price'>{lastPrice.slice(0, -2)}$</h1>
                    )}
                    <h3>You Own:</h3>
                    {prices && prices.length > 0 && (
                        <div>
                            <p>{asset_info.quantity} Shares</p>
                            <p>{(lastPrice * asset_info.quantity).toFixed(2)}$</p>
                        </div>
                        )}
                </div>
            </div>
            {
                !transactionsOpen ?
                <button className='open_transactions_button_down' onClick={handleTransactionsWindow}> &#x25BC;</button> :
                <button className='open_transactions_button_up' onClick={handleTransactionsWindow}> &#x25B2;</button>

            }
            <div className={`transactions_container ${transactionsOpen ? '' : 'hidden'}`}>
                <div>
                <div className='portfolio_transaction_label'>
                    <b>DATE</b>
                    <b>QTY.</b>
                    <b>PRICE</b>
                    <b>OPERATION</b>
                </div>
                    {
                        transactionsList.map((transaction) => {
                            const date = formatStringDate(transaction.timestamp);

                            return (
                                <div key={transaction.transaction_id} className='portfolio_transaction_container'>
                                    <p>{date}</p>
                                    <p>{transaction.quantity}</p>
                                    <p>{(Number(transaction.quantity) * Number(transaction.price)).toFixed(4)}$</p>
                                    <b>{transaction.transaction_type === 'buy' ? 'Bought' : 'Sold'}</b>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className={`transactions_container_spacer ${transactionsOpen ? '' : 'hidden'}`}></div>
        </div>
    )
}

export default PortfolioItem;