import { Search, Upload } from 'react-feather'
import styles from './_addElement.module.sass'
import { useRef, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import elementsAtom from './elementsAtom'
import Lottie from 'react-lottie-player'
import loadingData from '../../../../loading.json'

const Header = ({setLoading}) => {
    const Searchbar = () => {

        const query = useRef('')
        
        const [elements, setElements] = useRecoilState(elementsAtom)

        const clientID = 58758127462563

        const search = () => {

            const getIcon = () => {
                setLoading(true)
                fetch(`https://api.iconscout.com/v3/search?query=${query.current}&product_type=item&asset=icon&sort=relevant&&price=free`, {
                    headers: {
                        'accept': 'application/json',
                        'Client-ID': clientID
                    }
                }).then(res=>res.json()).then((res)=>{
                    setElements({...elements, content: res.response.items.data})
                    setLoading(false)
                })
            }

            switch (elements.type) {
                case 'icons':
                    getIcon()
                break
                default: getIcon()
            }

        }

        const searchOnEnter = (e) => {
            query.current = e.target.value
            if(e.key.toLowerCase() === 'enter'){
                search()
            }
        }
        const elem = useRef(null)
        useEffect(()=>{
            elem.current.focus()
        }, [])
        
        return (
            <div className={styles.search}>
                <input ref={elem} type='text' placeholder='Search for any element' onKeyDown={(e)=>searchOnEnter(e)} />
                <Search onMouseDown={search} />
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

const Assets = ({onClick, loading}) => {
    
    const [elements, setElements] = useRecoilState(elementsAtom)

    const Loading = () => {
        return (
            <div className={styles.loading}>
                <Lottie
                    loop
                    animationData={loadingData}
                    play
                    style={{ width: 150, height: 150 }}
                />
            </div>
        )
    }

    return (
        <div className={styles.assets}>
            <div className={styles.elementsType}>
                <div onMouseDown={()=>setElements({...elements, type: 'icons'})} className={elements.type==='icons'?styles.active:null}>Icons</div>
                <div onMouseDown={()=>setElements({...elements, type: 'images'})} className={elements.type==='images'?styles.active:null}>Images</div>
                <div onMouseDown={()=>setElements({...elements, type: 'text'})} className={elements.type==='text'?styles.active:null}>Text</div>
                <div onMouseDown={()=>setElements({...elements, type: 'uploaded'})} className={elements.type==='uploaded'?styles.active:null}>Uploaded</div>
            </div>
            {
                loading?
                <Loading />
                :
                <div className={styles.content}>
                    {elements.content.map((item, key)=>{
                        return <img key={key} alt='' src={item.urls.png_64} onClick={(e)=>onClick(e)} />
                    })}
                </div>
            }
        </div>
    )
}

const AddElement = ({func}) => {
    const [loading, setLoading] = useState(false)
    return (
        <div className={styles.wrapper}>
            <Header setLoading={setLoading} />
            <Assets onClick={func} loading={loading} />
        </div>
    )
}

export default AddElement