import React from 'react'
import styles from './_loading.module.sass'

const Loading = () => {
  return (
    <div className={styles.loading}>
        <div className={styles.loader} />
    </div>
  )
}

export default Loading