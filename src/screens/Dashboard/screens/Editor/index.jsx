import Details from './components/Details'
import Header from './components/Header'
import Main from './components/Main'
import styles from './_editor.module.sass'
import Layers from './components/Layers'

const Editor = () => {
    return (
        <div className={styles.editor}>
            <Header />
            <div className={styles.mainsection}>
                <Layers />
                <Main />
                <Details />
            </div>
        </div>
    )
}

export default Editor