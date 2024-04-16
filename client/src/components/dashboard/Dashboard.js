import NavBar from "../navbar/NavBar";
import WatchListSkeleton from "./watchlist/WatchListSkeleton";
import WatchListItem from "./watchlist/WatchListItem";
import PortFolioSkeleton from "./portfolio/PortFolioSkeleton";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useRef, forwardRef } from 'react';
import PortfolioItem from "./portfolio/PortFolioItem";
import defaultImage from '../../users_propic/noimage.png';

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

    const API_URL = props.API_URL;

    // const [username, setUsername] = useState(props.username);
    // const [email, setEmail] = useState(props.email);
    const [userId, setUserId] = useState(props.userId || 0);
    const [balance, setBalance] = useState(props.balance || 0);
    const [watchlist, setWatchlist] = useState([]);
    const [portfolio, setPortfolio] = useState([]);
    const [mergedWatchlistPortfolio, setMerged] = useState([]);
    const [userImage, setUserImage] = useState(defaultImage);
    const [PL, setPL] = useState(0);
    const [equity, setEquity] = useState(0);

    const focus = () => {
        inputRef.current.focus();
    }

    const loadImage = (userId) => {
        import(`../../users_propic/userid${userId}.jpeg`).then(image => {
          setUserImage(image.default)
        }).catch(() => {
            console.error(`Failed to load image for user with id ${userId}`);
        });
      };

      // Calling loadImage just at first rendering to limit memory usage
      if (userImage === defaultImage) {
          loadImage(userId);
      }

    // formats the data received from the api to a simpler object
    function formatAssetData (data) {
        if (data && data.metadata && data.prices) {
            const assetInfo = {
                "metadata": {
                    "name": data.metadata["1. Name"],
                    "symbol": data.metadata['2. Symbol'],
                    "last_refreshed": data.metadata['3. Last Refreshed']
                },
                "prices" : data.prices.map(price => price[1]['4. close'])
            };

            return assetInfo;
        } else {
            return null;
        }
    }

    async function fetchUserPortfolio (userId) {
        const resp = await fetch(API_URL + '/portfolio/get_user_portfolio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId
            })
        });

        const data = await resp.json();

        return data;
    }

    async function getLastPrices (assetList) {
        const resp = await fetch(API_URL + '/market/get_latest_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // The function accepts also a list
                asset_symbols: assetList
            })
        });

        const data = await resp.json();

        return data;
    }

    async function fetchWatchlistData (userId) {
        const resp = await fetch(API_URL + '/watchlist/load_assets_prices', {
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
            return [];
        }

    }

    function mergeWatchlistPortfolio (watchlist, portfolio) {
        let merged = [];

        for (let asset of watchlist) {
            if (asset.metadata.symbol && !merged.includes(asset.metadata.symbol)) {
                merged.push(asset.metadata.symbol);
            }
        }

        for (let asset of portfolio) {
            if (asset.asset_symbol && !merged.includes(asset.asset_symbol)) {
                merged.push(asset.asset_symbol);
            }
        }

        return merged;
    }

    function calculatePL (totalProfit, balance, initialBalance) {
        if (totalProfit && balance && initialBalance) {
            const currentEquity = balance + totalProfit;
            const difference = currentEquity - initialBalance;
    
            const plType = difference >= 0 ? 'Profit' : 'Loss';
    
            return {
                currentEquity: currentEquity,
                difference: difference,
                plType: plType
            };
        } else return {
                currentEquity: 0,
                difference: 0,
                plType: 'Profit'
        }
    }

    function calculateTotalProfit () {
        let totalProfit = 0;
        if (mergedWatchlistPortfolio && portfolio && portfolio.length > 0) {
            for (let asset of portfolio) {
                if (mergedWatchlistPortfolio[asset.asset_symbol] && asset.quantity) {
                    totalProfit += (mergedWatchlistPortfolio[asset.asset_symbol] * asset.quantity);
                }
            }
            return totalProfit;
        }
    }

    useEffect(() => {
        async function fetchData () {
            const watchlistData = await fetchWatchlistData(userId);
            const portfolioData = await fetchUserPortfolio(userId);
            if (watchlistData && portfolioData) {
                setWatchlist(watchlistData);
                setPortfolio(portfolioData);
            } else {
                throw new Error('Error retrieving data');
            }
        }
        fetchData();
    }, [userId]);

    useEffect(() => {
        async function fetchData () {
            const mergedWatchlistPortfolio = mergeWatchlistPortfolio(watchlist, portfolio);

            if (mergedWatchlistPortfolio.length > 0) {
                const lastPrices = await getLastPrices(mergedWatchlistPortfolio);

                let formattedLastPrices = {};

                for (const asset of lastPrices) {
                    formattedLastPrices[asset.symbol] = asset.price;
                }

                setMerged(formattedLastPrices);
            }

        }
        if (watchlist && portfolio) {
            fetchData();
        }
    }, [watchlist.length, portfolio.length]);

    useEffect(() => {
        // Setting initialBalance to 10000 as it is the default value in database
        const initialBalance = 10000;
        const totalProfit = calculateTotalProfit();
        const plResult = calculatePL(totalProfit, balance, initialBalance);

        setEquity(plResult.currentEquity);
        setPL(plResult.difference);
    }, [portfolio, mergedWatchlistPortfolio]);


    return (
        <div className='dashboard_element'>
            <NavBar ref={inputRef} userId={userId} API_URL={API_URL}/>
            {
                portfolio && balance > 0 ?
                <div className='dashboard_container'>
                    <div className='dashboard_user_container'>
                        <img className='user_image'
                        src= {userImage}
                        alt="gray user profile icon"/>
                        <p className='user_username'>{props.username[0].toUpperCase() + props.username.substring(1)}</p>
                        <div>
                            <p>Margin</p>
                            <p className="user_balance">{balance.toFixed(3)}$</p>
                        </div>
                        <div>
                            <p>Portfolio</p>
                            <p className="user_balance">{equity > 0 ? (equity - balance).toFixed(3) : 0}$</p>
                        </div>
                        <div>
                            <p>Equity</p>
                            <p className="user_balance">{equity.toFixed(3)}$</p>
                        </div>
                        <div>
                            <p>P/L</p>
                            {
                            PL >= 0 ?
                                <p className="user_balance" style={{color: 'green'}}>+ {PL.toFixed(3)}$</p> :
                                <p className="user_balance" style={{color: 'red'}}>{PL.toFixed(3)}$</p>
                            }
                        </div>
                    </div>
                    <div className='watchlist_transactions_container'>
                        <div className='watchlist_container'>
                            <h3 className='watchlist_title'>WatchList</h3>
                            {
                                watchlist && watchlist.length > 0 ? watchlist.map((asset) => {
                                    return <Link key={asset.metadata.name} to={{pathname: '/market'}} state={{ symbol: asset.metadata.symbol, name: asset.metadata.name, userId: userId }}><WatchListItem asset={asset} lastPrice={mergedWatchlistPortfolio[asset.metadata.symbol]}/></Link>
                                }) :
                                <div></div>
                            }
                            <div  onClick={focus}>
                                <WatchListSkeleton/>
                            </div>
                        </div>
                        <div className='portfolio_container'>
                            <h3 className='portfolio_title'>Portfolio</h3>
                            {
                                portfolio && portfolio.length > 0 ? portfolio.map((asset) => {
                                    return <Link key={asset.asset_name} to={{pathname: '/market'}} state={{ symbol: asset.asset_symbol, name: asset.asset_name, quantity: asset.quantity, userId: userId }}><PortfolioItem userId={userId} asset={asset} lastPrice={mergedWatchlistPortfolio[asset.asset_symbol]} API_URL={API_URL}/></Link>
                                }) :
                                <div></div>
                            }
                            <div onClick={focus}>
                                <PortFolioSkeleton/>
                            </div>
                        </div>
                    </div>
                </div> :
            <div>Loading</div>
            }
        </div>
    )
}

export default Dashboard;