import { Link } from 'react-router-dom'
import styles from './_workspace.module.sass'

const Empty = () => {
    return (
        <div className={styles.empty}>
            <h2>Welcome to your Workspace</h2>
            <p>This is your own private space to create, edit and store your NFT Collections.</p>
            <Link to='editor'>Create Your First NFT Project</Link>
        </div>
    )
}

const Workspace = () => {
    return (
        <div className={styles.workspace}>
            <Empty />
        </div>
    )
}

export default Workspace