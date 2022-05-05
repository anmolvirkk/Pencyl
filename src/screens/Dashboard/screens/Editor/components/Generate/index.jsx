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
  let images = []
  for(let i = 0; i<parseInt(currentProject.supply); i++){
    let image = []
    let layerKeys = Object.keys(currentProject.layers)
    layerKeys.reverse()
    layerKeys.forEach((item)=>{
      let random = Math.floor(Math.random() * (currentProject.layers[item].assets.length - 1))
      image.push(currentProject.layers[item].assets[random].elem)
    })
    images.push(image)
  }
  return (
    <div className={styles.images}>
      {images.map((item, key)=>{
          return (
            <div key={key} className={styles.imageWrapper} style={{aspectRatio: `${currentProject.canvas.width}/${currentProject.canvas.height}`}}>
              <div className={styles.image} style={{background: currentProject.canvas.background}}>
                  {item.map((item, key)=>{
                    return (
                      <div key={key} className={styles.asset}>
                        <img src={item} alt='' />
                      </div>
                    )
                  })}
              </div>
            </div>
          )
      })}
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