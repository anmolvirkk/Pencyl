import React from 'react'
import Header from './components/Header'
import styles from './_projects.module.sass'
import Title from './components/Title'
import Workspace from './components/Workspace'
import Footer from '../../../LandingPage/components/Footer'

const Projects = () => {
    return (
        <div className={styles.projects}>
            <div style={{width: '100%'}}>
                <Header />
                <Title />
            </div>
            <Workspace />
            <Footer />
        </div>
    )
}

export default Projects