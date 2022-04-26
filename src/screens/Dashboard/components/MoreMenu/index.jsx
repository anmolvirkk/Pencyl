import styles from './_moremenu.module.sass'
import {MoreVertical} from 'react-feather'
import { useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

const MoreMenu = ({options}) => {
    const [open, setOpen] = useState(false)
    const runFunc = (item) => {
        item.func()
        setOpen(false)
    }
    return (
        <OutsideClickHandler onOutsideClick={()=>setOpen(false)}>
            <div className={styles.moremenu}>
                <MoreVertical onMouseDown={()=>setOpen(!open)} />
                {open?    
                    <div className={styles.options}>
                        {options.map((item, key)=>{
                            return (
                                <div key={key} className={styles.option} onMouseDown={()=>runFunc(item)}>
                                    {item.name}
                                </div>
                            )
                        })}
                    </div>
                :null}
            </div>
        </OutsideClickHandler>
    )
}

export default MoreMenu