import { Search, Upload } from 'react-feather'
import styles from './_addElement.module.sass'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import elementsAtom from './elementsAtom'

const Header = () => {
    const Searchbar = () => {
        return (
            <div className={styles.search}>
                <input type='text' placeholder='Search for any element' />
                <Search />
            </div>
        )
    }
    const UploadBtn = () => {
        return (
            <div className={styles.upload}>
                <div className={styles.content}>
                    <Upload />
                </div>
            </div>
        )
    }
    return (
        <div className={styles.header}>
            <Searchbar />
            <UploadBtn />
        </div>
    )
}

const Assets = () => {
    
    const [elements, setElements] = useRecoilState(elementsAtom)

    const clientID = 58758127462563

    const getIcon = (query) => {
        fetch(`https://api.iconscout.com/v3/search?query=${query}&product_type=item&asset=icon&per_page=10&page=1&sort=relevant`, {
            headers: {
                'accept': 'application/json',
                'Client-ID': clientID
            }
        }).then(res=>res.json()).then((res)=>{
            setElements({...elements, content: res.response.items.data})
        })
    }

    getIcon('apple')

    return (
        <div className={styles.assets}>
            <div className={styles.elementsType}>
                <div className={elements.type==='icons'?styles.active:null}>Icons</div>
                <div className={elements.type==='illustrations'?styles.active:null}>Illustrations</div>
                <div className={elements.type==='images'?styles.active:null}>Images</div>
            </div>
            <div className={styles.content}>
                {elements.content.map((item, key)=>{
                    return <img key={key} alt='' src={item.urls.png_64} />
                })}
            </div>
        </div>
    )
}

const AddElement = () => {
    return (
        <div className={styles.wrapper}>
            <Header />
            <Assets />
        </div>
    )
}

export default AddElement