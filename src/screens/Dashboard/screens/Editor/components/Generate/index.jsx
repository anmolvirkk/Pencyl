import React from 'react'
import { useRecoilState } from 'recoil'
import activeProjectAtom from '../../../activeProjectAtom'
import projectsAtom from '../../../projectsAtom'
import Header from '../Header'
import styles from './_generate.module.sass'

const Images = () => {
  const [projects] = useRecoilState(projectsAtom)
  const [activeProject] = useRecoilState(activeProjectAtom)
  let currentProject = JSON.parse(projects.filter(i=>i.id===activeProject)[0].project)
  console.log(currentProject)
  return (
    <div className={styles.images}>

    </div>
  )
}

const Generate = () => {
  return (
    <div className={styles.generate}>
        <Header type='generate' />
        <Images />
    </div>
  )
}

export default Generate