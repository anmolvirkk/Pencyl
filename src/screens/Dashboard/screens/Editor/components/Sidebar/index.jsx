import styles from './_sidebar.module.sass'
import {Layers, Box, Image} from 'react-feather'
import { NavLink } from 'react-router-dom'

const options = [
    {
        name: 'Layers',
        icon: <Layers />
    },
    {
        name: 'Elements',
        icon: <Box />
    },
    {
        name: 'Images',
        icon: <Image />
    }
]

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            {options.map((item)=>{
                return (
                    <NavLink to={item.name.toLowerCase()} className={({isActive})=>isActive?`${styles.option} ${styles.active}`:styles.option}>
                        <div className={styles.content}>
                            {item.icon}
                            <p>{item.name}</p>
                        </div>
                    </NavLink>
                )
            })}
        </div>
    )
}

export default Sidebar