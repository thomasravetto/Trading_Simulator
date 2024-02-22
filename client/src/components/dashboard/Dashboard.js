import NavBar from "../navbar/NavBar";
import WatchListSkeleton from "./watchlist/WatchListSkeleton";
import WatchListItem from "./watchlist/WatchListItem";
import PortFolioSkeleton from "./portfolio/PortFolioSkeleton";
import { useEffect, useState } from "react";

const dummy = {
        "metadata": {
            "1. Information": "Intraday (60min) open, high, low, close prices and volume",
            "2. Symbol": "MSFT",
            "3. Last Refreshed": "2024-02-21 19:00:00",
            "4. Interval": "60min",
            "5. Output Size": "Compact",
            "6. Time Zone": "US/Eastern"
        },
        "prices": [
            [
                "2024-02-21 19:00:00",
                {
                    "1. open": "403.3250",
                    "2. high": "405.0000",
                    "3. low": "403.3100",
                    "4. close": "404.8500",
                    "5. volume": "72982"
                }
            ],
            [
                "2024-02-21 18:00:00",
                {
                    "1. open": "403.3000",
                    "2. high": "403.5000",
                    "3. low": "330.5300",
                    "4. close": "403.4900",
                    "5. volume": "49889"
                }
            ],
            [
                "2024-02-21 17:00:00",
                {
                    "1. open": "402.8200",
                    "2. high": "405.6500",
                    "3. low": "402.1800",
                    "4. close": "403.3000",
                    "5. volume": "273413"
                }
            ],
            [
                "2024-02-21 16:00:00",
                {
                    "1. open": "402.1800",
                    "2. high": "429.1340",
                    "3. low": "382.5820",
                    "4. close": "402.8000",
                    "5. volume": "7056257"
                }
            ],
            [
                "2024-02-21 15:00:00",
                {
                    "1. open": "398.7700",
                    "2. high": "402.2900",
                    "3. low": "398.1400",
                    "4. close": "402.1800",
                    "5. volume": "3132887"
                }
            ],
            [
                "2024-02-21 14:00:00",
                {
                    "1. open": "399.0100",
                    "2. high": "399.9800",
                    "3. low": "397.5600",
                    "4. close": "398.7600",
                    "5. volume": "1601725"
                }
            ],
            [
                "2024-02-21 13:00:00",
                {
                    "1. open": "399.5700",
                    "2. high": "400.0000",
                    "3. low": "398.6100",
                    "4. close": "399.0200",
                    "5. volume": "1261158"
                }
            ],
            [
                "2024-02-21 12:00:00",
                {
                    "1. open": "400.0500",
                    "2. high": "400.1600",
                    "3. low": "398.7100",
                    "4. close": "399.5800",
                    "5. volume": "1114507"
                }
            ],
            [
                "2024-02-21 11:00:00",
                {
                    "1. open": "399.7660",
                    "2. high": "400.7100",
                    "3. low": "399.1740",
                    "4. close": "400.0200",
                    "5. volume": "1425608"
                }
            ],
            [
                "2024-02-21 10:00:00",
                {
                    "1. open": "398.8100",
                    "2. high": "400.4700",
                    "3. low": "398.7300",
                    "4. close": "399.7900",
                    "5. volume": "2021285"
                }
            ],
            [
                "2024-02-21 09:00:00",
                {
                    "1. open": "400.0000",
                    "2. high": "400.4900",
                    "3. low": "397.2200",
                    "4. close": "398.8100",
                    "5. volume": "2837414"
                }
            ],
            [
                "2024-02-21 08:00:00",
                {
                    "1. open": "400.8900",
                    "2. high": "402.7900",
                    "3. low": "399.6700",
                    "4. close": "399.9250",
                    "5. volume": "480244"
                }
            ],
            [
                "2024-02-21 07:00:00",
                {
                    "1. open": "400.8200",
                    "2. high": "400.9000",
                    "3. low": "399.6900",
                    "4. close": "399.8000",
                    "5. volume": "26187"
                }
            ],
            [
                "2024-02-21 06:00:00",
                {
                    "1. open": "401.1900",
                    "2. high": "401.3000",
                    "3. low": "400.5500",
                    "4. close": "400.7400",
                    "5. volume": "7199"
                }
            ],
            [
                "2024-02-21 05:00:00",
                {
                    "1. open": "401.1900",
                    "2. high": "401.7800",
                    "3. low": "401.0000",
                    "4. close": "401.1700",
                    "5. volume": "6643"
                }
            ],
            [
                "2024-02-21 04:00:00",
                {
                    "1. open": "401.2100",
                    "2. high": "401.9200",
                    "3. low": "400.7500",
                    "4. close": "401.1500",
                    "5. volume": "13899"
                }
            ],
            [
                "2024-02-20 19:00:00",
                {
                    "1. open": "401.2100",
                    "2. high": "401.6500",
                    "3. low": "401.0600",
                    "4. close": "401.3500",
                    "5. volume": "15792"
                }
            ]
        ]
    }

function Dashboard (props) {

    const [username, setUsername] = useState(props.username);
    const [email, setEmail] = useState(props.email);
    const [userId, setUserId] = useState(props.userId);
    const [watchlist, setWatchlist] = useState([]);

    function formatAssetData (data) {
        if (data && data.metadata && data.prices) {
            const assetInfo = [];
            const assetPrices = [];

            data.prices.map((price) => {
                return assetPrices.push(price[1]['4. close']);
            });

            const symbol = data.metadata['2. Symbol'];
            const lastRefreshed = data.metadata['3. Last Refreshed'];

            assetInfo.push({
                "metadata": {
                    "symbol": symbol,
                    "last_refreshed": lastRefreshed
                },
                "prices" : assetPrices
            });

            return assetInfo;
        } else {
            return false;
        }
    }

    async function fetchWatchlistData (userId) {
        const resp = await fetch('/v1/watchlist/load_assets_prices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'user_id': userId
            })
        });

        const data = await resp.json();

        const formattedData = data.map((asset) => {
            return formatAssetData(asset);
        })

        return formattedData;
    }

    useEffect(() => {
        async function fetchData () {
            const data = await fetchWatchlistData(userId);
            setWatchlist(data);
        }
        fetchData();
    }, []);

    return (
        <div className='dashboard_element'>
            <NavBar/>
            <div className='dashboard_container'>
                <div className='dashboard_user_container'>
                    <img className='user_image' src="https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png" alt="gray user profile icon png @transparentpng.com"/>
                    <p className='user_username'>{props.username}</p>
                </div>
                <div className='watchlist_transactions_container'>
                    <div className='watchlist_container'>
                        <h3 className='watchlist_title'>WatchList</h3>
                        {
                            watchlist.map((asset) => {
                                return <WatchListItem asset={asset[0]}/>
                            })
                        }
                        <WatchListSkeleton/>
                    </div>
                    <div className='portfolio_container'>
                        <h3 className='portfolio_title'>Portfolio</h3>
                        <PortFolioSkeleton/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;