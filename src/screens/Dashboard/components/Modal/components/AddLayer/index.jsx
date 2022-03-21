import { useRef } from 'react'
import styles from './_addLayer.module.sass'

const AddLayer = ({func}) => {
    const layerName = useRef('')
    return (
        <div className={styles.wrapper}>
            <input type='text' placeholder='Layer Name' onChange={(e)=>layerName.current=e.target.value} />
            <button onMouseDown={()=>func(layerName.current)}>
                <p>Add</p>
            </button>
        </div>
    )
}

export default AddLayer