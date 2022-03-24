import { useEffect, useRef } from 'react'
import styles from './_addLayer.module.sass'

const AddLayer = ({func}) => {
    const layerName = useRef('')
    const onEnter = (e) => {
        if(e.key === 'Enter'){
            func(layerName.current)
        }
    }
    const elem = useRef(null)
    useEffect(()=>{
        elem.current.focus()
    }, [])
    return (
        <div className={styles.wrapper}>
            <input ref={elem} type='text' placeholder='Layer Name' onChange={(e)=>layerName.current=e.target.value} onKeyDown={(e)=>onEnter(e)} />
            <button onMouseDown={()=>func(layerName.current)}>
                <p>Add</p>
            </button>
        </div>
    )
}

export default AddLayer