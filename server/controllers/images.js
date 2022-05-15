import os from 'os'
import fs from 'fs'
import { exec } from 'child_process'

const decodeBase64Image = async (dataString) => {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {}
  
    if (matches.length !== 3) {
      return new Error('Invalid input string')
    }
  
    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64')
  
    return response
}

const makeFolder = async (req) => {

  let rootFolder = os.homedir()+'\\downloads\\pencyl'

  if (!fs.existsSync(rootFolder)) {
    fs.mkdirSync(rootFolder)
  }

  let folder = rootFolder + '\\' + req.body.folder.replace(' ', '_')

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }

  let openFolder = folder

  if(os.userInfo().username.includes(' ')){
    openFolder = folder.replace(os.userInfo().username, os.userInfo().username.toUpperCase().replace(' ', '').substring(0, 6)+'~1')
  }

  exec(`start ${openFolder}`)

  return folder

}

export const addImage = async (req, res) => {
    try {
      makeFolder(req).then((folder)=>{
        decodeBase64Image(req.body.image).then((e)=>{
          fs.readdir(folder, (_, files) => {
              fs.writeFileSync(folder+'\\'+req.body.folder+'_#'+files.length+'.jpg', e.data, ()=>{console.log('image added')})
              res.json()
              res.header('Access-Control-Allow-Origin', '*')
              res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
          })
        })
      })
    } catch (error) {
        res.json({message: error.message})
    }
}