import styles from './_workspace.module.sass'

const Empty = () => {
    return (
        <div className={styles.empty}>
            <h2>Welcome to your Workspace</h2>
            <p>This is your own private space to create, edit and store your NFT Collections.</p>
            <button>Create Your First NFT Project</button>
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