import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const OperationWindow = forwardRef((props, ref) => {
const { user_id, asset_symbol, asset_name, asset_quantity, API_URL } = props;
    
    const [price, setAssetPrice] = useState('');
    const [operation_value, setOperationValue] = useState(100);
    const [quantity, setQuantity] = useState(1);
    const [buying_operation, setBuyingOperation] = useState(true);
    const [component_visible, setComponentVisible] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    async function getLatestData (asset_symbol) {
        const resp = await fetch(API_URL + '/market/get_latest_data', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                asset_symbols: asset_symbol
            })
        });

        const latestData = await resp.json();

        if (latestData.length > 0) {
            return latestData[0];
        } else {
            return latestData;
        }

    }

    function calculateQuantity (operation_cost, price) {
        const quantity = operation_cost / price;
        setQuantity(quantity.toFixed(6));
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

                if (resp.ok) {
                    setSuccess(true);
                    setError('');
                } else {
                    data = await resp.json();
                    setError(data.error);
                }

            } else if (operation === 'sell') {

                const resp = await fetch(API_URL + '/portfolio/sell_asset', {
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

                if (resp.ok) {
                    setSuccess(true);
                    setError('');
                } else {
                    data = await resp.json();
                    setError(data.error);
                }

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
        <div>
            {
                !success ?
                <div className={`operations_background_cover ${!component_visible ? "operations_window_hidden" : ""}`}>
                    <div className={`operations_window_container`}>
                        <div className="operations_window">
                            <div className={`operations_asset_info ${buying_operation ? 'buy' : 'sell'}`}>
                                <div>
                                    <h1>{asset_symbol} </h1>
                                    <p>{asset_name}</p>
                                </div>
                                <button className="close_button" onClick={() => {
                                    setComponentVisibility(false);
                                    setSuccess(false);
                                    setError('');
                                }}>&#215;</button>
                                <h2>{price.slice(0, -2)}$</h2>
                            </div>
                            <div className="operations_buysell_container">
                                <button className="buy" onClick={() => {
                                    handleSetBuyingOperation(true);
                                    setError('');}}>BUY</button>
                                <button className="sell" onClick={() => {
                                    handleSetBuyingOperation(false);
                                    setError('');}}>SELL</button>
                            </div>
                        </div>
                        <div className="operations_input_container">
                            <input type="number" placeholder="Quantity" value={operation_value} onChange={(e) => setOperationValue(e.target.value >= 0 ? parseFloat(e.target.value) : 0)}></input>
                            <span>$</span>
                        </div>
                        <div className="operation_message">
                            <p>You are {buying_operation ? 'buying' : 'selling'}:</p>
                            <p>{quantity} Shares</p>
                        </div>
                        {
                            error ?
                            <div className="operations_error_container">{error}</div> :
                            <div></div>
                        }
                        {
                            buying_operation ?
                            <button className="operation_button buy" onClick={() => handleTransaction(user_id, asset_symbol, asset_name, price, quantity, 'buy')}>BUY</button> :
                            <button className="operation_button sell" onClick={() => handleTransaction(user_id, asset_symbol, asset_name, price, quantity, 'sell')}>SELL</button>
                        }
                    </div>
                </div> :
                <div className={!component_visible ? "operations_window_hidden" : ""}>
                    <div className="operations_success_background">
                    <button className="close_button_success" onClick={() => {
                                    setComponentVisibility(false);
                                    setSuccess(false);
                                    setError('');
                                }}>&#215;</button>
                        <div style={{textAlign: 'center'}}>
                            <p>You succesfully {buying_operation ? 'bought' : 'sold'}:</p>
                            <p>{quantity} shares!</p>
                        </div>
                        <button className={buying_operation ? 'operate_again_button buy_again' : 'operate_again_button sell_again'} onClick={() => setSuccess(false)}>{buying_operation ? 'BUY AGAIN' : 'SELL AGAIN'}</button>
                    </div>
                </div>
            }
        </div>
    )
});

export default OperationWindow;