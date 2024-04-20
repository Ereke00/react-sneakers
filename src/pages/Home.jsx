import React from "react";
import Index from "../components/Card";
import {AppContext} from "../App";

function Home({
              items,
              searchValue,
              setSearchValue,
              onChangeSearchInput,
              onAddToFavorite,
              onAddToCart,
              isLoading})

{

    const renderItems = () =>{
        const filteredItems = items.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))

        return(
            (isLoading
                ? [Array(8)]
                : filteredItems.map((item,index)=>(
                <Index
                    key={index}
                    onFavorite={(obj) =>onAddToFavorite(obj)}
                    onPlus={(obj) => onAddToCart(obj)}
                    loading={isLoading}
                    {...item}
                />
            ))
        ))
    }

    return(
        <div className="content p-40">
            <div className="d-flex align-center mb-40 justify-between">
                <h1>{searchValue ? `Поиск по запросу  ${searchValue}` : 'Все кроссовкии '}</h1>
                <div className="search-block d-flex">
                    <img src="/img/search (1).svg" alt="Search"/>
                    {searchValue && (
                        <img
                            onClick={() =>setSearchValue('')}
                            className="clearBtn clear cu-p"
                            src="/img/btn-remove.svg"
                            alt="Clear"
                        />
                    )}
                    <input onChange={onChangeSearchInput} value={searchValue} placeholder="Поиск..."/>
                </div>
            </div>
            <div className="d-flex flex-wrap">

                {renderItems()}
            </div>
        </div>
    );
}

export default Home;