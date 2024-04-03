import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const OperationWindow = forwardRef((props, ref) => {
const { user_id, asset_symbol, asset_name, API_URL } = props;
    
    const [price, setAssetPrice] = useState('');
    const [operation_value, setOperationValue] = useState(100);
    const [quantity, setQuantity] = useState(1);
    const [buying_operation, setBuyingOperation] = useState(true);
    const [component_visible, setComponentVisible] = useState(false);

    async function getLatestData (asset_symbol) {
        const resp = await fetch(API_URL + '/market/get_latest_data', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                asset_symbol: asset_symbol
            })
        });

        const latestData = await resp.json();

        return latestData;
    }

    function calculateQuantity (operation_cost, price) {
        const quantity = operation_cost / price;
        setQuantity(quantity);
        return quantity;
    }

    async function handleTransaction (userId, assetSymbol, assetName, price, quantity, operation) {
        try {
            if (!userId, !assetSymbol, !assetName, !price, !quantity, !operation) {
                console.error('Missing arguments');
                return;
            }

            let data;

            if (operation === 'buy') {

                console.log(price, quantity);

                const resp = await fetch(API_URL + '/portfolio/buy_asset', {
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        user_id: userId,
                        asset_symbol: assetSymbol,
                        asset_name: assetName,
                        price: price,
                        quantity: quantity
                    })
                });

                data = await resp.json();

            } else if (operation === 'short') {

                const resp = await fetch(API_URL + '/portfolio/short_asset', {
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        user_id: userId,
                        asset_symbol: assetSymbol,
                        asset_name: assetName,
                        price: price,
                        quantity: quantity
                    })
                });

                data = await resp.json();
            }
        } catch (error) {
            console.error(error);
            return;
        }
    }

    function handleSetBuyingOperation (bool) {
        setBuyingOperation(bool);
    }

    function setComponentVisibility (bool, isBuying) {
        setComponentVisible(bool);
        setBuyingOperation(isBuying);
    }

    useEffect(() => {
        async function fetchData () {
            const latestData = await getLatestData(asset_symbol);

            setAssetPrice(latestData.price);
        }
        fetchData();
    }, [asset_symbol]);

    useEffect(() => {
        calculateQuantity(operation_value, price);
    }, [operation_value, price]);

    useImperativeHandle(ref, () => {
        return {
            setComponentVisibility,
        }
    })

    return (
        <div className={`operations_background_cover ${!component_visible ? "operations_window_hidden" : ""}`}>
            <div className={`operations_window_container`}>
                <div className="operations_window">
                    <div className={`operations_asset_info ${buying_operation ? 'buy' : 'sell'}`}>
                        <div>
                            <h1>{asset_symbol} </h1>
                            <p>{asset_name}</p>
                        </div>
                        <button className="close_button" onClick={() => setComponentVisibility(false)}>&#215;</button>
                        <h2>{price.slice(0, -2)}$</h2>
                    </div>
                    <div className="operations_buysell_container">
                        <button className="buy" onClick={() => handleSetBuyingOperation(true)}>BUY</button>
                        <button className="sell" onClick={() => handleSetBuyingOperation(false)}>SELL</button>
                    </div>
                </div>
                <div className="operations_input_container">
                    <input type="number" placeholder="Quantity" value={operation_value} onChange={(e) => setOperationValue(e.target.value >= 0 ? parseFloat(e.target.value) : 0)}></input>
                    <span>$</span>
                </div>
                <div className="operation_message">
                    <p>You are {buying_operation ? 'buying' : 'selling'}:</p>
                    <p>{quantity.toFixed(4)} Shares</p>
                </div>
                {
                    buying_operation ?
                    <button className="operation_button buy" onClick={() => handleTransaction(user_id, asset_symbol, asset_name, price, quantity, 'buy')}>BUY</button> :
                    <button className="operation_button sell" onClick={() => handleTransaction(user_id, asset_symbol, asset_name, price, quantity, 'short')}>SELL</button>
                }
            </div>
        </div>
    )
});

export default OperationWindow;