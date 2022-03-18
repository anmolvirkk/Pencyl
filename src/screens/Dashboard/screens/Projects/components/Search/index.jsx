import styles from './_search.module.sass'
import { Plus, Search } from 'react-feather'

const Tabs = () => {
    return (
        <ul className={styles.tabs}>
            <li className={styles.active}>Projects</li>
            <li>Uploads</li>
            <li>Archived</li>
        </ul>
    )
}

const Searchbar = () => {

    const Options = () => {
        return (
            <ul className={styles.options}>
                <li className={styles.addproject}>
                    <Plus />
                    <p>New Folder</p>
                </li>
                <li className={styles.create}>
                    <Plus />
                    <p>Create Project</p>
                </li>
            </ul>
        )
    }

    return (
        <div className={styles.searchbar}>
            <div className={styles.input}>
                <Search />
                <input type='text' placeholder='Search' />
            </div>
            <Options />
        </div>
    )
}

const Title = () => {
    return (
        <div className={styles.title}>
            <h3>My Workspace</h3>
            <Tabs />
            <Searchbar />
        </div>
    )
}

export default Title