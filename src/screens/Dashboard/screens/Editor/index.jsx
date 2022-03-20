import Details from './components/Details'
import Header from './components/Header'
import Main from './components/Main'
import styles from './_editor.module.sass'
import Sidebar from './components/Sidebar'
import SideSection from './components/SideSection'

const Editor = () => {
    return (
        <div className={styles.editor}>
            <Header />
            <div className={styles.mainsection}>
                <Sidebar />
                <SideSection />
                <Main />
                <Details />
            </div>
        </div>
    )
}

export default Editor