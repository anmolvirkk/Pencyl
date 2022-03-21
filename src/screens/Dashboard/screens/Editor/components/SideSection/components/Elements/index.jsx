import { ChevronUp, Search } from 'react-feather'
import styles from './_elements.module.sass'
import Lottie from 'react-lottie-player'
import { useEffect, useState } from 'react'
import loadingAnim from '../../../../../../loading.json'
import { useRecoilState } from 'recoil'
import itemsAtom from '../itemsAtom'

const LayerSelector = () => {
    return (
        <div className={styles.layerSelector}>
            <p>Select Layer</p>
            <ChevronUp />
        </div>
    )
}

const Searchbar = () => {
    return (
        <div className={styles.search}>
            <input type='text' placeholder='Search' />
            <Search />
        </div>
    )
}

const Items = () => {

    const [items, setItems] = useRecoilState(itemsAtom)

    const clientID = '58758127462563'

    const Illustrations = () => {

        const query = 'shape'
        let illustrations = []
        
        useEffect(()=>{
            if(!items){
                fetch(`https://api.iconscout.com/v3/search?query=${query}&product_type=item&asset=icon&per_page=10&page=1&sort=relevant&price=free`, {
                    headers: {
                        'accept': 'application/json',
                        'Client-ID': clientID
                    }
                })
                .then(res=>res.json())
                .then(res=>{
                    res.response.items.data.forEach((item)=>{
                        if(!illustrations){
                            illustrations = [item.urls.png_64]
                        }else{
                            illustrations = [...illustrations, item.urls.png_64]
                        }
                    })
                })
                .then(()=>{
                    setItems([...illustrations])
                })
            }
        }, [])

        if(!items){
            return (
                <div className={styles.loading}>
                    <Lottie 
                        loop
                        play
                        animationData={loadingAnim}
                        style={{height: 250, width: 250}}
                        speed={1.5}
                    />
                </div>
            )
        }else{
            return (
                <div className={styles.illustrations}>
                    {items.map((item, key)=>{
                        return <img src={item} alt='' key={key} />
                    })}
                </div>
            )
        }
    }

    return (
        <div className={styles.items}>
            <Illustrations />
        </div>
    )
}

const Elements = () => {
    return (
        <div className={styles.elements}>
            <Searchbar />
            <Items />
            <LayerSelector />
        </div>
    )
}

export default Elements