import Details from './components/Details'
import Header from './components/Header'
import Main from './components/Main'
import styles from './_editor.module.sass'
import Layers from './components/Layers'
import { useSetRecoilState } from 'recoil'
import modalAtom from '../../components/Modal/modalAtom'
import { useEffect } from 'react'

const Editor = () => {
    const setModal = useSetRecoilState(modalAtom)
    useEffect(()=>{
        setModal({type: 'start'})
    }, [setModal])
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