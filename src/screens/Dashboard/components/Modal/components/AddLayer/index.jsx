import { useRef } from 'react'
import styles from './_addLayer.module.sass'

const AddLayer = ({func}) => {
    const layerName = useRef('')
    const onEnter = (e) => {
        if(e.key === 'Enter'){
            func(layerName.current)
        }
    }
    return (
        <div className={styles.wrapper}>
            <input type='text' placeholder='Layer Name' onChange={(e)=>layerName.current=e.target.value} onKeyDown={(e)=>onEnter(e)} />
            <button onMouseDown={()=>func(layerName.current)}>
                <p>Add</p>
            </button>
        </div>
    )
}

export default AddLayer