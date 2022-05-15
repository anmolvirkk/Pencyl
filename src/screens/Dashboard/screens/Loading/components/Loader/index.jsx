import React from 'react'
import styles from './_loader.module.sass'

const Loader = React.memo(() => {
  return (
    <div className={styles.loader} />
  )
})

export default Loader