import { useRef, forwardRef, useState } from 'react';
import Logo from '../../logo.png';
import { Link } from 'react-router-dom';

const NavBar = forwardRef((props, ref) => {
    const [assetList, setAssetList] = useState([
    ]);

    const [userId, setUserId] = useState(props.userId)

    let timer;

    function searchSymbolOnStopTyping (event) {
        const inputText = event.target.value;

        clearTimeout(timer);

        timer = setTimeout(() => {
            searchSymbol(inputText);
        }, 800);
    }

    async function searchSymbol (symbolInput) {
        const resp = await fetch('/v1/market/symbol_search', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                symbol: symbolInput
            })
        });
        const data = await resp.json();
        const bestMatches = data.bestMatches;

        setAssetList(bestMatches);
    }

    return (
        <div className='navbar_container'>
            <div className='navbar'>
                <a href='/'><img className='navbar_logo' src={Logo} alt='app logo'/></a>
                <div className='navbar_searchbar'>
                    <input ref={ref} className='navbar_market_input' type='text' onChange={searchSymbolOnStopTyping}></input>
                    <div className='navbar_asset_list'>
                        {
                            assetList&& assetList.length > 0 ? assetList.map((asset) => {
                                const symbol = asset['1. symbol'];
                                const name = asset['2. name'];
                                const currency = asset['8. currency'];

                                return (<Link to={'/market'} state={{ symbol: symbol, name: name, userId: userId }}>
                                    <span className='navbar_list_element'>
                                        <h3 className='navbar_list_symbol'>{symbol}</h3>
                                        <p className='navbar_list_title'>{name}</p>
                                        <p className='navbar_list_currency'>{currency}</p>
                                        </span>
                                    </Link>);
                            }) :
                            <div></div>
                        }
                    </div>
                </div>
                <div className='navbar_links_container'>
                    <a href='/'><p className='navbar_link'>Dashboard</p></a>
                    <a href='/market'><p className='navbar_link'>Market</p></a>
                    <a href='/about'><p className='navbar_link'>About</p></a>
                    <a href='/'><p className='navbar_link'>Profile</p></a>
                </div>
            </div>
            <div className='navbar_empty_container'></div>
        </div>
    )
})

export default NavBar;