import { ChevronUp, Search } from 'react-feather'
import styles from './_elements.module.sass'

const LayerSelector = () => {
    return (
        <div className={styles.layerSelector}>
            <p>Select Layer</p>
            <ChevronUp />
        </div>
    )
}

const Searchbar = () => {
    return (
        <div className={styles.search}>
            <input type='text' placeholder='Search' />
            <Search />
        </div>
    )
}

const Items = () => {
    return (
        <div className={styles.items}>

        </div>
    )
}

const Elements = () => {
    return (
        <div className={styles.elements}>
            <Searchbar />
            <Items />
            <LayerSelector />
        </div>
    )
}

export default Elements