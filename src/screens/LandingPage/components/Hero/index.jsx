import styles from './_hero.module.sass'

const Hero = () => {
    return (
        <div className={styles.hero}>
            <div className={styles.wrapper}>
                <div className={styles.content}>
                    <h1>Create, generate and publish NFT collections from scratch</h1>
                    <p>Use powerful and intuitive tools for layering and editing your very own NFT projects.</p>
                </div>
            </div>
            <video src='bg.mp4' autoPlay muted loop />
        </div>
    )
}

export default Hero