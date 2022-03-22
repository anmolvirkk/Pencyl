import styles from './_header.module.sass'
import {User} from 'react-feather'

const Launch = () => {
    return (
        <button className={styles.launch}>
            Launch App
        </button>
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