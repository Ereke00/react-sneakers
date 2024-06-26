import styles from './Card.module.scss'
import React from "react";
import ContentLoader from "react-content-loader";
import {AppContext} from "../../App";

function Index({id,
                   onFavorite,
                   title,
                   imageUrl,
                   price,
                   onPlus,
                   favorited=false,
                    loading=false
               }){
    const [isFavorite,setIsFavorite] = React.useState(favorited)
    const {isItemAdded} = React.useContext(AppContext)
    const obj = {id,parentId: id ,title,imageUrl,price}

    const onClickPlus = () =>{
        onPlus(obj)
    }

    const onClickFavorite = () =>{
        onFavorite(obj);
        setIsFavorite(!isFavorite)
    }

    return(
        <div className={styles.card}>
            {
                loading ?
                    (<ContentLoader
                        speed={2}
                        width={180}
                        height={270}
                        viewBox="0 0 150 270"
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                    >
                        <rect x="0" y="0" rx="10" ry="10" width="150" height="155" />
                        <rect x="0" y="164" rx="5" ry="5" width="150" height="15" />
                        <rect x="0" y="193" rx="6" ry="6" width="100" height="15" />
                        <rect x="0" y="234" rx="5" ry="5" width="80" height="25" />
                        <rect x="118" y="232" rx="10" ry="10" width="32" height="32" />
                    </ContentLoader>) :
                    (<div>
                        {onFavorite &&(
                            <div className={styles.favorite} onClick={onClickFavorite}>
                                <img  src={isFavorite ? `/img/liked.svg` : "/img/unliked.svg"}
                                 alt="unliked"/>
                            </div>
                        )}
                        <img width={133} height={112} src={imageUrl} alt="Sneakers"/>
                        <h5>{title}</h5>
                        <div className="d-flex justify-between align-center">
                            <div className="d-flex flex-column ">
                                <spans>Цена: </spans>
                                <b>{price} руб.</b>
                            </div>
                            {onPlus && (
                                <img
                                className={styles.plus}
                                onClick={onClickPlus}
                                src={isItemAdded(id) ? '/img/btn-checked.svg' : "/img/btn-plus.svg"}
                                alt="plus"/>
                            )}
                        </div>
                    </div>
                    )}
        </div>
    );
}

export default Index;