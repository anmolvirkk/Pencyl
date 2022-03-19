import styles from './_header.module.sass'
import {User} from 'react-feather'

const Upgrade = () => {
    return (
        <button className={styles.upgrade}>
            Upgrade
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
                <Upgrade />
                <Profile />
            </div>
        </header>
    )
}

export default Header