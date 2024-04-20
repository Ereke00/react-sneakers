import * as url from "url";
import React from "react";
import Info from '../Info'
import {AppContext} from "../../App";
import axios from 'axios';
import {useCart} from "../../hooks/useCart";
import styles from './Drawer.module.scss'

const delay =(ms) => new Promise((resolve)=>setTimeout(resolve,ms))

function Index({onClose,onRemove,items=[],opened}){
    const [isOrderComplete,setIsOrderComplete] = React.useState(false);
    const [orderId,setOrderId] = React.useState(null);
    const [isLoading,setIsLoading] = React.useState(false);
    const {cartItems,setCartItems,totalPrice} = useCart()

    const onClickOrder =async () =>{
        try {
            setIsLoading(true)
            const {data} = await axios.post('https://63c3d4c8a9085635752cf8ee.mockapi.io/orders',{
                items:cartItems,
            })
            setOrderId(data.id)
            setIsOrderComplete(true);
            setCartItems([]);

            for (let i=0; i<cartItems.length; i++){
                const item = cartItems[i];
                axios.put('https://63bfe993e262345656f33958.mockapi.io/cart'+item.id);
                await delay(1000)
            }
        }catch (error){
            alert('Ошибка при создании заказа :(')
        }
        setIsLoading(false)
    }

    return(
        <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''} `}>
            <div className={styles.drawer}>

                <h2 className="d-flex justify-between mb-30">
                    Корзина
                    <img onClick={onClose} className="cu-p" src="img/btn-remove.svg" alt="Close" />
                </h2>

                {
                    items.length>0 ? (
                        <fragments>
                            <div className="items flex">
                                {items.map((obj) => (
                                    <div key={obj.id} className="cartItem d-flex align-center mb-20">
                                        <div
                                            style={{ backgroundImage: `url(${obj.imageUrl})` }}
                                            className="cartItemImg"></div>

                                        <div className="mr-20 flex">
                                            <p className="mb-5">{obj.title}</p>
                                            <b>{obj.price} руб.</b>
                                        </div>
                                        <img
                                            onClick={()=>onRemove(obj.id)}
                                            className="removeBtn"
                                            src="/img/btn-remove.svg"
                                            alt="remove"/>
                                    </div>
                                ))}
                            </div>
                            <div className="cartTotalBlock">
                                <ul>
                                    <li>
                                        <span>Итого:</span>
                                        <div></div>
                                        <b>{totalPrice} руб.</b>
                                    </li>
                                    <li>
                                        <span>Налог 5%:</span>
                                        <div></div>
                                        <b>{totalPrice*5/100} руб.</b>
                                    </li>
                                </ul>
                                <button onClick={onClickOrder} disabled={isLoading} className="greenButton">
                                    Оформить заказ
                                    <img src="/img/arrow.svg" alt="arrow"/>
                                </button>
                            </div>
                        </fragments>
                    ) : (
                        <Info
                            title={isOrderComplete ? "Заказ оформлен" : "Корзина пустая"}
                            description={isOrderComplete ? `Ваш заказ №${orderId} скоро будет передан курьерской службе` :  "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ"}
                            image={ isOrderComplete ? "/img/order-checked.jpg" : "/img/empty-cart.jpg"}
                        />
                    )
                }
            </div>
        </div>
    );
}
export default Index;
