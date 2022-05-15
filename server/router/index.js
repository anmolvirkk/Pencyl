import express from 'express'
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from '../controllers/projects.js'
import { addImage } from '../controllers/images.js'

const router = express.Router()

router.get('/data', getProjects)
router.get('/data:id', getProjectById)
router.post('/data', createProject)
router.patch('/data:id', updateProject)
router.delete('/data:id', deleteProject)

router.post('/image', addImage)

export default router