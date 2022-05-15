import React from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Process from './components/Process'

const LandingPage = () => {
    return (
        <React.Fragment>
            <Header />
            <Hero />
            <Process />
            <Footer />
        </React.Fragment>
    )
}

export default LandingPage