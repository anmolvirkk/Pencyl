import { useRecoilState } from 'recoil'
import modalAtom from './modalAtom'
import AddLayer from './components/AddLayer'
import AddElement from './components/AddElement'
import AddElementOrLayer from './components/AddElementOrLayer'
import OutsideClickHandler from 'react-outside-click-handler/build/OutsideClickHandler'
import styles from './_modal.module.sass'

const Modal = () => {
    const [modal, setModal] = useRecoilState(modalAtom)
    const Content = () => {
        switch (modal.type) {
            case 'addElementOrLayer': return <AddElementOrLayer addLayer={modal.addLayer} addElement={modal.addElement} />
            case 'addElement': return <AddElement func={modal.func} />
            case 'editElement': return <AddElement func={modal.func} />
            case 'addLayer': return <AddLayer func={modal.func} />
            default: return null
        }
    }
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

export default Modal