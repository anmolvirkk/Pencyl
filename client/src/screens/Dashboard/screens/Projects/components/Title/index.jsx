import styles from './_title.module.sass'
import { Plus, Search } from 'react-feather'
import { useRecoilState, useSetRecoilState } from 'recoil'
import modalAtom from '../../../../components/Modal/modalAtom'
import searchAtom from './searchAtom'
import React from 'react'

const Searchbar = React.memo(() => {

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

    const [search, setSearch] = useRecoilState(searchAtom)

    return (
        <div className={styles.searchbar}>
            <div className={styles.input}>
                <Search />
                <input type='text' placeholder='Search' value={search} onChange={(e)=>setSearch(e.target.value)} />
            </div>
            <Options />
        </div>
    )
})

const Title = React.memo(() => {
    return (
        <div className={styles.title}>
            <h3>My Workspace</h3>
            <Searchbar />
        </div>
    )
})

export default Title