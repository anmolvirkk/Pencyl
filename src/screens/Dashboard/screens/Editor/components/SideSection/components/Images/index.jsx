import { ChevronUp, Search } from 'react-feather'
import styles from './_images.module.sass'

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

const Images = () => {
    return (
        <div className={styles.images}>
            <Searchbar />
            <Items />
            <LayerSelector />
        </div>
    )
}

export default Images