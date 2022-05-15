import Details from './components/Details'
import Header from './components/Header'
import Main from './components/Main'
import styles from './_editor.module.sass'
import Layers from './components/Layers'
import { Route, Routes } from 'react-router-dom'
import Generate from './components/Generate'
import React from 'react'

const Editor = React.memo(() => {
    const Designer = React.memo(() => {
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
    })
    return (
        <Routes>
            <Route index element={<Designer />} />
            <Route path='generate' element={<Generate />} />
        </Routes>
    )
})

export default Editor