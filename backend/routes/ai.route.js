import {Router} from 'express';
import * as aiController from '../controllers/ai.controller.js';

const router=Router();

router.route('/get-ai-result').post(aiController.getAIResult);

export default router;