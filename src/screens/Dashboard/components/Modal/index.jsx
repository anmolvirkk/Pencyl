import { useRecoilState } from 'recoil'
import modalAtom from './modalAtom'
import AddLayer from './components/AddLayer'
import AddElement from './components/AddElement'
import Start from './components/Start'
import OutsideClickHandler from 'react-outside-click-handler/build/OutsideClickHandler'
import styles from './_modal.module.sass'
import Error from './components/Error'
import { useState } from 'react'
import Loader from '../../screens/Loading/components/Loader'

const Modal = () => {
    const [modal, setModal] = useRecoilState(modalAtom)
    const [loading, setLoading] = useState(false)
    const Content = () => {
        switch (modal.type) {
            case 'start': return <Start setLoading={setLoading} />
            case 'addElement': return <AddElement func={modal.func} />
            case 'editElement': return <AddElement func={modal.func} />
            case 'addLayer': return <AddLayer func={modal.func} error={modal.error} />
            case 'editLayer': return <AddLayer func={modal.func} edit={true} error={modal.error} />
            case 'error': return <Error text={modal.text} />
            default: return null
        }
    }
    if(loading){
        return (
            <div className={styles.wrapper}>
                <Loader />
            </div>
        )
    }else{
        return (
            <div className={styles.wrapper}>
                <OutsideClickHandler onOutsideClick={()=>setModal(false)}>
                    <div className={styles.modal}>
                        <Content />
                    </div>
                </OutsideClickHandler>
            </div>
        )
    }
}

export default Modal