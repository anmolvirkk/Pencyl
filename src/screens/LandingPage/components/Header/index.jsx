import styles from './_header.module.sass'
import {User} from 'react-feather'
import { Link } from 'react-router-dom'

const Launch = () => {
    return (
        <Link to='dashboard' className={styles.launch}>
            Launch App
        </Link>
    )
}

const Profile = () => {
    return (
        <div className={styles.profile}>
            <User />
        </div>
    )
}

const Header = () => {
    return (
        <header className={styles.header}>
            <img alt='' src='/logo.png' />
            <div className={styles.menu}>
                <Launch />
                <Profile />
            </div>
        </header>
    )
}

export default Header