import { Router } from 'express';
import { body } from 'express-validator';
import * as projectController from '../controllers/project.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
const router = Router();

router.route("/create").post(
    verifyJWT,
    body('name').isString().withMessage('Name is reqiured'),
    projectController.createProject
)

router.route('/all').get(verifyJWT, projectController.getAllProject)
router.route('/add-user').put(verifyJWT, body('projectId').isString().withMessage('Project ID is required'),body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail().custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'), projectController.addUserToProject)

router.route('/get-project/:projectId').get(verifyJWT,projectController.getProjectById)

export default router;