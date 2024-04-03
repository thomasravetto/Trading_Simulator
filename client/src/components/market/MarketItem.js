import React, { useRef, useState, useEffect } from "react";
import NavBar from "../navbar/NavBar";
import CandleStickChart from "./chart/CandleStickChart";
import OperationWindow from "./OperationWindow";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

function MarketItem (props) {
    const location = useLocation();
    const { symbol, name, userId } = location.state || {};

    const API_URL = props.API_URL;

    const [user_id, setUserId] = useState(userId);
    const [asset_symbol, setAssetSymbol] = useState(symbol);
    const [asset_name, setAssetName] = useState(name);
    const [timeframe, setTimeframe] = useState('60min');
    const [isItemInWatchlist, setItemInWatchlist] = useState(false);

    const myRef = useRef(null);
    const operationRef = useRef();
    const chartRef = useRef(null);
    const [asset, setAsset] = useState();

    async function fetchMarketItemData (symbol, timeframe) {
        const resp = await fetch(API_URL + '/market/load_asset', {
            method: "post",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                asset_symbol: symbol,
                timeframe: timeframe,
                outputsize: 'full',
                fullData: true
            })
        });
        const data = await resp.json();

        return data;
    }

    async function addToWatchlist (userId, assetSymbol, assetName) {
        const resp = await fetch(API_URL + '/watchlist/add_asset', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: userId,
                asset_symbol: assetSymbol,
                asset_name: assetName
            })
        });

        const itemAdded = await resp.json();

        return itemAdded;
    }

    async function removeFromWatchlist (userId, assetSymbol, assetName) {
        const resp = await fetch(API_URL + '/watchlist/remove_asset', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: userId,
                asset_symbol: assetSymbol,
                asset_name: assetName
            })
        });

        const itemRemoved = await resp.json();

        return itemRemoved;
    }

    async function checkIfItemInWatchlist (userId, assetSymbol, assetName) {
        const resp = await fetch(API_URL + '/watchlist/load_watchlist', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: userId
            })
        });

        const watchlist = await resp.json();

        let isItemInWatchlist;

        if (watchlist.length > 0) {
            isItemInWatchlist = watchlist.some((asset) => {
                return asset.asset_symbol === assetSymbol && asset.asset_name === assetName;
            })
        } else {
            isItemInWatchlist = false;
        }


        return setItemInWatchlist(isItemInWatchlist);
    }

    function formatData (data) {
        if (data && data.metadata && data.prices) {
            const assetInfo = [];

            const symbol = data.metadata['2. Symbol'];
            const lastRefreshed = data.metadata['3. Last Refreshed'];

            assetInfo.push({
                "metadata": {
                    "symbol": symbol,
                    "name": name,
                    "last_refreshed": lastRefreshed
                },
                "prices" : data.prices
            });

            return assetInfo;
        } else {
            return false;
        }
    }

    // useEffect(() => {
    //     // Access the CandleStickChart component and call its zoomX method
    //     if (chartRef.current) {
    //         onScroll(scrollTop);
    //     }
    //   }, [scrollTop, chartRef]);

    async function fetchData(asset_symbol, timeframe) {
        setTimeframe(timeframe);
        const data = await fetchMarketItemData(asset_symbol, timeframe);
        if (data) {
            const formattedData = formatData(data);
            setAsset(formattedData);
        } else {
            throw new Error();
        }
    }

    useEffect(() => {
        setAssetSymbol(symbol);
        setAssetName(name);
        checkIfItemInWatchlist(user_id, symbol, name);
        if (symbol && timeframe) {
            fetchData(symbol, timeframe);
        }
    }, [symbol, name]);

    return (
        <div className="market_element">
        <NavBar userId={userId} API_URL={API_URL}/>
        <div className="market_container"
            ref={myRef}>
            {asset ? (
                <div>
                    <div className="market_item_title">
                        <div className="market_item_title_container">
                            <b>{asset_symbol.toUpperCase()}</b>
                            <p> {name}</p>
                        </div>
                        {
                            isItemInWatchlist ?
                                <button className="market_item_remove_from_watchlist" onClick={() => removeFromWatchlist(user_id, asset_symbol, asset_name)
                                .then(checkIfItemInWatchlist(user_id, asset_symbol, asset_name))}>Remove From Watchlist &#10060;</button> :
                                <button className="market_item_add_to_watchlist" onClick={() => addToWatchlist(user_id, asset_symbol, asset_name)
                                .then(checkIfItemInWatchlist(user_id, asset_symbol, asset_name))}>Add To Watchlist &#43;</button>
                        }
                    </div>
                    <div className="market_item_timestamp_buysell_container">
                        <div className="market_item_timestamp">
                            <button className={timeframe === '30min' ? 'timeframe_button_active' : null} onClick={() => fetchData(asset_symbol, '30min')}>30 min</button>
                            <button className={timeframe === '60min' ? 'timeframe_button_active' : null} onClick={() => fetchData(asset_symbol, '60min')}>60 min</button>
                            <button className={timeframe === 'daily' ? 'timeframe_button_active' : null} onClick={() => fetchData(asset_symbol, 'daily')}>Daily</button>
                            <button className={timeframe === 'weekly' ? 'timeframe_button_active' : null} onClick={() => fetchData(asset_symbol, 'weekly')}>Weekly</button>
                        </div>
                        <div className="market_item_buysell">
                            <button className="market_item_button buy" onClick={() => operationRef.current?.setComponentVisibility(true, true)}>BUY</button>
                            <button className="market_item_button sell" onClick={() => operationRef.current?.setComponentVisibility(true, false)}>SELL</button>
                        </div>
                    </div>
                    <CandleStickChart ref={chartRef} prices={asset[0].prices} />
                    <OperationWindow ref={operationRef} user_id={user_id} asset_symbol={asset_symbol} asset_name={asset_name} API_URL={API_URL}/>
                </div>
            ) : asset_symbol ?
                    <div></div> :
                    <div className="market_item_no_asset_title_container">
                        <h1 className="market_item_no_asset_title">Use the Searchbar to find the asset you want to analyse.</h1>
                    </div>}
        </div>
    </div>
    )
}

export default MarketItem;