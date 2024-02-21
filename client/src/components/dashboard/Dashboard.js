import NavBar from "../navbar/NavBar";
import WatchListSkeleton from "./watchlist/WatchListSkeleton";
import WatchListItem from "./watchlist/WatchListItem";
import PortFolioSkeleton from "./portfolio/PortFolioSkeleton";

const dummy = {
    "information": {
        "symbol": "AAPL",
        "last price": "2024-02-20 19:00:00",
        "time zone": "US/Eastern"
    },
    "prices":[
        {"timestamp": "2024-02-20 19:00:00", "price": "181.7400"},
        {"timestamp": "2024-02-20 18:00:00", "price": "181.7000"},
        {"timestamp": "2024-02-20 17:00:00", "price": "181.5500"},
        {"timestamp": "2024-02-20 16:00:00", "price": "181.6950"},
        {"timestamp": "2024-02-20 15:00:00", "price": "181.6200"},
        {"timestamp": "2024-02-20 14:00:00", "price": "180.9000"},
        {"timestamp": "2024-02-20 13:00:00", "price": "180.7300"},
        {"timestamp": "2024-02-20 12:00:00", "price": "180.7550"},
        {"timestamp": "2024-02-20 11:00:00", "price": "181.0850"},
        {"timestamp": "2024-02-20 10:00:00", "price": "180.7350"},
        {"timestamp": "2024-02-20 09:00:00", "price": "180.8350"},
        {"timestamp": "2024-02-20 08:00:00", "price": "182.2400"},
        {"timestamp": "2024-02-20 07:00:00", "price": "181.8700"},
        {"timestamp": "2024-02-20 06:00:00", "price": "181.6100"},
        {"timestamp": "2024-02-20 05:00:00", "price": "181.3800"},
        {"timestamp": "2024-02-20 04:00:00", "price": "181.4100"},
        {"timestamp": "2024-02-16 19:00:00", "price": "181.9600"}
    ]
}

function Dashboard (props) {
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
                        <WatchListItem watchlist={dummy}/>
                        <WatchListItem watchlist={dummy}/>
                        <WatchListItem watchlist={dummy}/>
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