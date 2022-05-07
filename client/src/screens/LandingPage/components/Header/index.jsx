import styles from './_header.module.sass'
import { Link } from 'react-router-dom'

const Launch = () => {
    return (
        <Link to='dashboard' className={styles.launch}>
            Launch App
        </Link>
    )
}

const Header = () => {
    return (
        <header className={styles.header}>
            <img alt='' src='/logo.png' />
            <div className={styles.menu}>
                <Launch />
            </div>
        </header>
    )
}

export default Header