import styles from './_title.module.sass'
import { Plus, Search } from 'react-feather'
import { useSetRecoilState } from 'recoil'
import modalAtom from '../../../../components/Modal/modalAtom'

const Searchbar = () => {

    const Options = () => {
        const setModal = useSetRecoilState(modalAtom)
        return (
            <ul className={styles.options}>
                <li className={styles.create} onMouseDown={()=>setModal({type: 'start'})}>
                    <Plus />
                    <p>Create Project</p>
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