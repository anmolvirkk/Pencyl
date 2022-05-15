import React from 'react'
import styles from './_error.module.sass'
import Lottie from 'react-lottie-player'
import error from './error.json'

const Error = ({text}) => {
  return (
    <div className={styles.error}>
        <Lottie
            loop={false}
            animationData={error}
            play
            style={{ width: 150, height: 150 }}
        />
        <p>{text}</p>
    </div>
  )
}

export default Error