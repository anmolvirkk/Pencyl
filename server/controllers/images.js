import os from 'os'
import fs from 'fs'

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

export const addImage = async (req, res) => {
    try {
        const folder = os.homedir()+'\\'+req.body.folder
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder)
          await decodeBase64Image(req.body.image).then((e)=>{
            fs.readdir(folder, (_, files) => {
                fs.writeFile(folder+'\\'+req.body.folder+'_#'+files.length+'.jpg', e.data, ()=>{console.log('image added')})
            })
          })
          res.json()
        }else{
          await decodeBase64Image(req.body.image).then((e)=>{
            fs.readdir(folder, (_, files) => {
                fs.writeFile(folder+'\\'+req.body.folder+'_#'+files.length+'.jpg', e.data, ()=>{console.log('image added')})
            })
          })
          res.json()
        }
    } catch (error) {
        res.json({message: error.message})
    }
}