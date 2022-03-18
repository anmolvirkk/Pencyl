import React from 'react'
import Header from './components/Header'
import styles from './_projects.module.sass'
import Title from './components/Title'
import Workspace from './components/Workspace'

const Projects = () => {
    return (
        <div className={styles.projects}>
            <Header />
            <Title />
            <Workspace />
        </div>
    )
}

export default Projects