import React, { useRef, useState, useEffect } from "react";
import NavBar from "../navbar/NavBar";
import CandleStickChart from "./chart/CandleStickChart";
import { useParams } from "react-router-dom";

function MarketItem (props) {
    const { symbol } = useParams();

    const myRef = useRef(null);
    const chartRef = useRef(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [asset, setAsset] = useState();

    function onScroll () {
        const scrollTop = myRef.current.scrollTop;
        setScrollTop(scrollTop);
    };


    async function fetchMarketItemData (symbol) {
        const resp = await fetch('/v1/market/load_asset', {
            method: "post",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                asset_symbol: symbol,
                timeframe: '60min',
                outputsize: 'full',
                fullData: true
            })
        });
        const data = await resp.json();

        console.log()

        return data;
    }

    function formatData (data) {
        if (data && data.metadata && data.prices) {
            const assetInfo = [];

            const symbol = data.metadata['2. Symbol'];
            const lastRefreshed = data.metadata['3. Last Refreshed'];

            assetInfo.push({
                "metadata": {
                    "symbol": symbol,
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

    useEffect(() => {
        async function fetchData() {
            const data = await fetchMarketItemData(symbol);
            if (data) {
                const formattedData = formatData(data);
                setAsset(formattedData);
            }
        }
        fetchData();
    }, [symbol]);

    return (
        <div className="market_element">
        <NavBar />
        <div className="market_container"
            ref={myRef}
            onScroll={onScroll}>
            {asset ? (
                <div>
                    <div className="market_item_title">
                        <b>{asset[0].metadata.symbol}</b>
                    </div>
                    <div className="market_item_timestamp">
                        <button>30 min</button>
                        <button>60 min</button>
                        <button>Daily</button>
                        <button>Weekly</button>
                    </div>
                    <CandleStickChart ref={chartRef} prices={asset[0].prices.reverse()} />
                </div>
            ) : <div></div>}
        </div>
    </div>
    )
}

export default MarketItem;