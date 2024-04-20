import axios from 'axios'
import Header from './components/Header'
import Index from './components/Drawer'
import Home from './pages/Home'
import React from "react";
import {Route,Routes} from 'react-router-dom'
import Favorites from "./pages/Favotites";
import Orders from "./pages/Orders";

export const AppContext = React.createContext({});

function App() {
    const [items,setItems] = React.useState([])
    const [cartItems,setCartItems] = React.useState([])
    const [cartOpened, setCartOpened] = React.useState(false)
    const [searchValue,setSearchValue] = React.useState('')
    const [favorites,setFavorites] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)


    React.useEffect( ()=>{
        async function fetchData() {
            try {
                const [cartResponse,favoritesResponse,itemsResponse] = await Promise.all([
                    axios.get('https://63bfe993e262345656f33958.mockapi.io/cart'),
                    axios.get('https://63c3d4c8a9085635752cf8ee.mockapi.io/favorites'),
                    axios.get('https://63bfe993e262345656f33958.mockapi.io/items'),
                ])

                setIsLoading(false)

                setCartItems(cartResponse.data)
                setFavorites(favoritesResponse.data)
                setItems(itemsResponse.data)
            }catch (e) {
                alert('Ошибка при запросе данных ;(')
                console.log(e)
            }
        }
        fetchData();
    },[]);

    const onAddToCart = async (obj) =>{
        try{
            const findItem = cartItems.find((item)=>Number(item.parentId)===Number(obj.id))
            if(findItem){
                setCartItems((prev) => prev.filter((item) => Number(item.parentId) !==Number(obj.id)))
                await axios.delete(`https://63bfe993e262345656f33958.mockapi.io/cart/${findItem.id}`)
            }else{
                setCartItems((prev)=>[...prev,obj])
                const {data} = await axios.post('https://63bfe993e262345656f33958.mockapi.io/cart',obj)
                setCartItems((prev)=>
                    prev.map((item=>{
                    if(item.parentId===data.parentId){
                        return{
                            ...item,
                            id:data.id
                        }
                    }
                    return item;
                }),
                        )
                )
            }
        } catch (e) {
            alert('Ошибка при добавлении в корзину')
            console.log(e)
        }
    }

    const onRemoveItem= (id)=> {
        try{
            axios.delete(`https://63bfe993e262345656f33958.mockapi.io/cart/${id}`)
            setCartItems((prev)=>prev.filter((item) => Number(item.id) !==Number(id)));
        }catch (e) {
            alert('Ошибка при удалении из корзины')
            console.log(e)
        }
    }

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    }

    const onAddToFavorite = async(obj) =>{
        try {
            if(favorites.find((favObj) => Number(favObj.id) ===Number(obj.id))){
                axios.delete(`https://63c3d4c8a9085635752cf8ee.mockapi.io/favorites/${obj.id}`)
                setFavorites((prev)=>prev.filter((item) => Number(item.id) !==Number(obj.id)));
            }else{
                const {data } = await axios.post('https://63c3d4c8a9085635752cf8ee.mockapi.io/favorites',obj)
                setFavorites((prev)=>[...prev,data])
            }
        }catch (error){
           alert('не удалась добавить в фавориты')
            console.log(error)
        }
    }

    const isItemAdded = (id) => {
        return cartItems.some((obj)=>Number(obj.parentId)===Number(id))
    }

    return (
    <AppContext.Provider
        value={{items,
            cartItems,
            favorites,
            isItemAdded,
            setCartOpened,
            setCartItems,
            onAddToCart,
            onAddToFavorite}}>
        <div className="wrapper clear">
            <Index
                onRemove={onRemoveItem}
                items={cartItems}
                onClose={()=> setCartOpened(false)}
                opened={cartOpened}
            />

            <Header onClickCart={()=> setCartOpened(true)} />

            <Routes>
                <Route
                    path="/"
                    exact
                    element={
                    <Home
                        cartItems={cartItems}
                        items={items}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        onChangeSearchInput={onChangeSearchInput}
                        onAddToFavorite={onAddToFavorite}
                        onAddToCart={onAddToCart}
                        isLoading={isLoading}
                        /*Sneakers={Sneakers}*/
                    />
                    }>
                </Route>

                <Route
                    path="/favorites"
                    exact
                    element={<Favorites
                        /*items={favorites}*/
                        onAddToFavorite={onAddToFavorite}
                    />}>
                </Route>

                <Route
                    path="/orders"
                    exact
                    element={<Orders
                        /*items={favorites}*/
                        onAddToFavorite={onAddToFavorite}
                    />}>
                </Route>

            </Routes>


        </div>
    </AppContext.Provider>
  );
}

export default App;
