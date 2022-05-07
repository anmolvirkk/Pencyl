import express from 'express'
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from '../controllers/projects.js'

const router = express.Router()

router.get('/', getProjects)
router.get('/:id', getProjectById)
router.post('/', createProject)
router.patch('/:id', updateProject)
router.delete('/:id', deleteProject)

export default router