import React from "react";
import Index from "../components/Card";
import {AppContext} from "../App";
import axios from "axios";

function Orders()
{
    const [isLoading, setIsLoading] = React.useState(true)
    const {onAddToFavorite,onAddToCart} = React.useContext(AppContext)
    const [orders,setOrders] =React.useState([])

    React.useEffect( ()=>{
        (async()=>{
            try {
                const {data} = await axios.get('https://63c3d4c8a9085635752cf8ee.mockapi.io/orders')
                setOrders(data.reduce((prev,obj) => [...prev,...obj.items],[]))
                setIsLoading(false)
            }catch (e) {
                alert('Ошибка при запросе заказов');
                console.error(e);
            }
        })();
    },[])
    return(
        <div className="content p-40">
            <div className="d-flex align-center mb-40 justify-between">
                <h1> Мои заказы</h1>
            </div>
            <div className="d-flex flex-wrap">
                {(isLoading
                    ? [Array(8)]
                    : orders).map((item,index)=>(
                    <Index
                        key={index}
                        loading={isLoading}
                        {...item}
                    />
                ))}
            </div>
        </div>
    );
}

export default Orders;