import styles from './_process.module.sass'

const Process = () => {
    return (
        <div className={styles.process}>
            <ul>
                <li>
                    <div className={styles.wrapper}>
                        <h3>Create layers for your project</h3>
                        <p>This will be the foundation of your project</p>
                    </div>
                </li>
                <li>
                    <div className={styles.wrapper}>
                        <h3>Add assets to each layer</h3>
                        <p>You can add your own assets (images) or select from a wide range of icons and images that are free to use</p>
                    </div>
                </li>
                <li>
                    <div className={styles.wrapper}>
                        <h3>Assign rarity to each asset variation in each layer</h3>
                        <p>by default the rarity is set equally for all variations until edited</p>
                    </div>
                </li>
                <li>
                    <div className={styles.wrapper}>
                        <h3>Automatically generate metadata</h3>
                        <p>We automatically generate metadata compatible with Ethereum and Solana Blockchain, this data can be edited.</p>
                    </div>
                </li>
                <li>
                    <div className={styles.wrapper}>
                        <h3>Deploy to the blockchain</h3>
                        <p>You can either create your custom mint page, use our marketplace to sell your collection or publish to external marketplaces</p>
                    </div>
                </li>
                <li>
                    <div className={styles.wrapper}>
                        <h3>Download 10,000+ images of your NFTs</h3>
                        <p>You also have the option to download your NFTs as images.</p>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default Process