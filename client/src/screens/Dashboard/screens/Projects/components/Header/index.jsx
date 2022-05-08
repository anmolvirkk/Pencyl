import styles from './_header.module.sass'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header className={styles.header}>
            <Link to='/'><img alt='' src='/logo.png' /></Link>
        </header>
    )
}

export default Header