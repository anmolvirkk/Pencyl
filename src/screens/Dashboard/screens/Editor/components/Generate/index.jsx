import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import activeProjectAtom from '../../../activeProjectAtom'
import projectsAtom from '../../../projectsAtom'
import Header from '../Header'
import styles from './_generate.module.sass'
import ReactDOMServer from 'react-dom/server'

const Images = () => {
  const [projects] = useRecoilState(projectsAtom)
  const [activeProject] = useRecoilState(activeProjectAtom)
  let currentProject = JSON.parse(projects.filter(i=>i.id===activeProject)[0].project)
  let layerKeys = Object.keys(currentProject.layers)
  layerKeys.reverse()
  useEffect(()=>{
    if(document.getElementById('images').children.length < parseInt(currentProject.supply)){
      const addImage = (res) => {
        setTimeout(()=>{
            let i = document.getElementById('images').children.length
            let image = []
            for(let i = 0; i < layerKeys.length; i++){
              let random = Math.floor(Math.random() * (currentProject.layers[layerKeys[i]].assets.length - 1))
              image.push(currentProject.layers[layerKeys[i]].assets[random].elem)
            }
            const html = ReactDOMServer.renderToStaticMarkup(
              <div key={i} className={styles.imageWrapper} style={{aspectRatio: `${currentProject.canvas.width}/${currentProject.canvas.height}`}}>
                <div className={styles.image} style={{background: currentProject.canvas.background}}>
                    {image.map((item, key)=>{
                      return (
                        <div key={key} className={styles.asset}>
                          <img src={item} alt='' />
                        </div>
                      )
                    })}
                </div>
              </div>
            )
            document.getElementById('images').innerHTML = document.getElementById('images').innerHTML+html
            document.getElementById('imagesWrapper').scrollTo(0, document.getElementById('imagesWrapper').scrollHeight)
            document.getElementById('currentImage').innerHTML = i+1
            document.getElementById('totalImages').innerHTML = currentProject.supply
            document.getElementById('progress').style.width = (((i+1)/parseInt(currentProject.supply))*100)+'%'
            res(null)
        }, 0)
      }

      const doNextPromise = (i) => {
        Promise.resolve(new Promise(res=>addImage(res))).then(()=>{
          i++
          if (i < parseInt(currentProject.supply)){
            doNextPromise(i)
          }
        })
      }

      doNextPromise(0)
    }

  }, [currentProject, layerKeys])
  return (
    <div className={styles.imagesWrapper} id='imagesWrapper'>
      <div className={styles.images} id='images' />
    </div>
  )
}

const Footer = () => {
  return (
    <div className={styles.footer} id='footer'>
      <div className={styles.index}>
        <div id='currentImage' /> &nbsp;/&nbsp; <div id='totalImages' />
      </div>
      <div className={styles.progressbar}>
        <div className={styles.progress} id='progress' />
      </div>
      <div className={styles.btns}>
        <button className={styles.btn}>
            Export Zip
        </button>
        <button className={styles.btn}>
            Create NFT Collection
        </button>
      </div>
    </div>
  )
}

const Generate = () => {
  return (
    <div className={styles.generate}>
        <Header type='generate' />
        <Images />
        <Footer />
    </div>
  )
}

export default Generate