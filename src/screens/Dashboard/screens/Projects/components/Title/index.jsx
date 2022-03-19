import styles from './_title.module.sass'
import { Plus, Search } from 'react-feather'
import { Link } from 'react-router-dom'

const Searchbar = () => {

    const Options = () => {
        return (
            <ul className={styles.options}>
                <li className={styles.addproject}>
                    <Plus />
                    <p>New Folder</p>
                </li>
                <li className={styles.create}>
                    <Link to='editor'>
                        <Plus />
                        <p>Create Project</p>
                    </Link>
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
            <Searchbar />
        </div>
    )
}

export default Title