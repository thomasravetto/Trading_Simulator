import NavBar from "../navbar/NavBar";
import WatchListSkeleton from "./watchlist/WatchListSkeleton";
import WatchListItem from "./watchlist/WatchListItem";
import PortFolioSkeleton from "./portfolio/PortFolioSkeleton";
import { useEffect, useState } from "react";

const dummy = [
    {
        "metadata": {
            "symbol": "NVDA",
            "last_refreshed": "2024-02-23 15:00:00"
        },
        "prices": [
            "784.6500",
            "789.9900",
            "794.8500",
            "799.0700",
            "798.9500",
            "802.0600",
            "800.0200",
            "798.6900",
            "800.6600",
            "802.0750",
            "807.0000",
            "786.8500",
            "800.2500",
            "801.1600",
            "798.3640",
            "797.9600",
            "788.2450"
        ]
    }
]

function Dashboard (props) {

    const [username, setUsername] = useState(props.username);
    const [email, setEmail] = useState(props.email);
    const [userId, setUserId] = useState(props.userId);
    const [watchlist, setWatchlist] = useState([]); //set back to empty

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
                                return <a href={`/market/${asset[0].metadata.symbol}`}><WatchListItem asset={asset[0]}/></a>
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