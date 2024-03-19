import NavBar from "../navbar/NavBar";
import WatchListSkeleton from "./watchlist/WatchListSkeleton";
import WatchListItem from "./watchlist/WatchListItem";
import PortFolioSkeleton from "./portfolio/PortFolioSkeleton";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useRef, forwardRef } from 'react';

const dummy = [
     [
        {
            "metadata": {
                "name": "Apple Inc",
                "symbol": "AAPL",
                "last_refreshed": "2024-03-18 19:00:00"
            },
            "prices": [
                "172.6300",
                "173.7200",
                "173.5000",
                "173.1800",
                "174.6300",
                "174.6900",
                "176.7580",
                "177.1800",
                "175.6400",
                "175.0800",
                "175.1160",
                "174.9750",
                "173.7000",
                "173.2300",
                "173.8500",
                "173.4600",
                "173.5700"
            ]
        }
    ],
    [
        {
            "metadata": {
                "name": "NVIDIA Corp",
                "symbol": "NVDA",
                "last_refreshed": "2024-03-18 19:00:00"
            },
            "prices": [
                "881.8500",
                "896.5000",
                "898.5300",
                "899.0000",
                "903.5200",
                "903.0460",
                "908.3250",
                "901.4400",
                "881.6200",
                "874.1770",
                "883.6200",
                "886.7100",
                "884.6000",
                "882.3100",
                "877.0500",
                "867.9500",
                "869.0000"
            ]
        }
    ],
    [
        {
            "metadata": {
                "name": "Tesla Inc",
                "symbol": "TSLA",
                "last_refreshed": "2024-03-18 19:00:00"
            },
            "prices": [
                "164.0100",
                "167.9100",
                "168.3100",
                "168.5700",
                "168.7800",
                "170.0300",
                "167.3620",
                "172.9950",
                "173.6600",
                "172.9700",
                "173.2620",
                "173.4400",
                "173.9400",
                "173.9500",
                "173.1350",
                "173.6700",
                "173.5800"
            ]
        }
    ],
    [
        {
            "metadata": {
                "name": "Microsoft Corporation",
                "symbol": "MSFT",
                "last_refreshed": "2024-03-18 19:00:00"
            },
            "prices": [
                "415.3750",
                "417.3800",
                "415.8300",
                "417.0000",
                "415.1300",
                "412.7400",
                "417.4900",
                "419.1500",
                "418.3400",
                "417.9550",
                "418.1900",
                "418.7500",
                "417.3700",
                "416.7600",
                "417.0400",
                "416.4750",
                "417.0200"
            ]
        }
    ]
]

function Dashboard (props) {
    const inputRef = useRef(null);

    const [username, setUsername] = useState(props.username);
    const [email, setEmail] = useState(props.email);
    const [userId, setUserId] = useState(props.userId);
    const [watchlist, setWatchlist] = useState([]); //set back to empty
    const [userImage, setUserImage] = useState(null);

    const focus = () => {
        inputRef.current.focus();
    }

    const loadImage = (userId) => {
        import(`../../users_propic/userid${userId}.jpeg`).then(image => {
          setUserImage(image.default)
        }).catch(() => {
            import(`../../users_propic/noimage.png`).then(image => {
                setUserImage(image.default)
            })
        });
      };
    loadImage(userId);

    function formatAssetData (data) {
        if (data && data.metadata && data.prices) {
            const assetInfo = [];
            const assetPrices = [];

            data.prices.map((price) => {
                return assetPrices.push(price[1]['4. close']);
            });

            const name = data.metadata["1. Name"];
            const symbol = data.metadata['2. Symbol'];
            const lastRefreshed = data.metadata['3. Last Refreshed'];

            assetInfo.push({
                "metadata": {
                    "name": name,
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

        if (data && data.length > 0) {
            const formattedData = data.map((asset) => {
                return formatAssetData(asset);
            })

            return formattedData;
        } else {
            return data;
        }

    }

    useEffect(() => {
        async function fetchData () {
            const data = await fetchWatchlistData(userId);
            if (data) {
                setWatchlist(data);
            } else {
                throw new Error(data);
            }
        }
        fetchData();
    }, []);

    return (
        <div className='dashboard_element'>
            <NavBar ref={inputRef} userId={userId}/>
            <div className='dashboard_container'>
                <div className='dashboard_user_container'>
                    <img className='user_image'
                    src= {userImage}
                    alt="gray user profile icon"/>
                    <p className='user_username'>{props.username[0].toUpperCase() + props.username.substring(1)}</p>
                </div>
                <div className='watchlist_transactions_container'>
                    <div className='watchlist_container'>
                        <h3 className='watchlist_title'>WatchList</h3>
                        {
                            watchlist && watchlist.length > 0 ? watchlist.map((asset) => {
                                return <Link to={{pathname: '/market'}} state={{ symbol: asset[0].metadata.symbol, name: asset[0].metadata.name, userId: userId }}><WatchListItem asset={asset[0]}/></Link>
                            }) :
                            <div></div>
                        }
                        <div  onClick={focus}>
                            <WatchListSkeleton/>
                        </div>
                    </div>
                    <div className='portfolio_container'>
                        <h3 className='portfolio_title'>Portfolio</h3>
                        <div onClick={focus}>
                            <PortFolioSkeleton/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;