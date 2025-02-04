import * as ai from '../services/ai.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAIResult=asyncHandler(async(req,res)=>{
    const prompt=req.query.prompt;
    const result=await ai.generateContent(prompt);
    res.send(result);
})
