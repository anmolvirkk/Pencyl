import { useEffect, useRef } from 'react'
import styles from './_addLayer.module.sass'

const AddLayer = ({func, edit, error}) => {
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
            <input className={layerName.current===''&&error?styles.error:null} ref={elem} type='text' placeholder={error?error:'Layer Name'} onChange={(e)=>layerName.current=e.target.value} onKeyDown={(e)=>onEnter(e)} />
            <button onMouseDown={()=>func(layerName.current)}>
                {edit?<p>Edit</p>:<p>Add</p>}
            </button>
        </div>
    )
}

export default AddLayer