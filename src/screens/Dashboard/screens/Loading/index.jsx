import React from 'react'
import Loader from './components/Loader'
import styles from './_loading.module.sass'

const Loading = React.memo(() => {
  return (
    <div className={styles.loading}>
      <Loader />
    </div>
  )
})

export default Loading