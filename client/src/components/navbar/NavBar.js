import { useRef, forwardRef, useState, useEffect } from 'react';
import Logo from '../../logo.png';
import { Link } from 'react-router-dom';

const NavBar = forwardRef((props, ref) => {
    const API_URL = props.API_URL;

    const inputRef = useRef(null);
    const assetListRef = useRef(null);

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
        if (!symbolInput || symbolInput === '') {
            setAssetList([])
        }

        const resp = await fetch(API_URL + '/market/symbol_search', {
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

    const clearInput = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        searchSymbol();
    };

    const focus = () => {
        inputRef.current.focus();
    }

    useEffect(() => {
        if (ref) {
            ref.current = inputRef.current;
        }

        document.addEventListener('click', handleClickOutside);

        return () => {
            // Remove event listener when component unmounts
            document.removeEventListener('click', handleClickOutside);
        };
    }, [ref]);

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target) && assetListRef.current && !assetListRef.current.contains(event.target)) {
            clearInput();
        }
    };

    return (
        <div className='navbar_container'>
            <div className='navbar'>
                <a href='/'><img className='navbar_logo' src={Logo} alt='app logo'/></a>
                <div className='navbar_searchbar'>
                    <input ref={inputRef}
                        className='navbar_market_input'
                        type='text'
                        onChange={searchSymbolOnStopTyping}>
                    </input>
                    <div ref={assetListRef} className='navbar_asset_list'>
                        {
                            assetList&& assetList.length > 0 ? assetList.map((asset) => {
                                const symbol = asset['1. symbol'];
                                const name = asset['2. name'];
                                const currency = asset['8. currency'];

                                return (<Link to={'/market'} key={symbol} state={{ symbol: symbol, name: name, userId: userId }} onClick={clearInput}>
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
                    <a onClick={focus}><p className='navbar_link'>Market</p></a>
                    <a href='/about'><p className='navbar_link'>About</p></a>
                    <a href='/'><p className='navbar_link'>Profile</p></a>
                </div>
            </div>
            <div className='navbar_empty_container'></div>
        </div>
    )
})

export default NavBar;