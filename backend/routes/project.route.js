import {Router} from 'express';
import{body} from 'express-validator';
import * as projectController from '../controllers/project.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
const router=Router();

router.post('/create',
    verifyJWT,
    body('name').isString().withMessage('Name is reqiured'),
    projectController.createProject
)

export default router;