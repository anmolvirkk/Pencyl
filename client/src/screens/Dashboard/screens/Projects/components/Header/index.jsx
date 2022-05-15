import styles from './_header.module.sass'
import { Link } from 'react-router-dom'
import React from 'react'

const Header = React.memo(() => {
    return (
        <header className={styles.header}>
            <Link to='/'><img alt='' src='/logo.png' /></Link>
        </header>
    )
})

export default Header