import { validationResult } from 'express-validator';
import * as projectService from '../services/project.service.js';
import { User } from "../models/user.model.js";
import { asyncHandler } from '../utils/asyncHandler.js';

export const createProject = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    // Fetch the logged-in user based on the email from the JWT or session
    // const loggedInUser = await User.findOne({ email: req.user.email });
    // if (!loggedInUser) {
    //     return res.status(404).json({ message: 'User not found' });
    // }

    // const userId = loggedInUser._id;
    const userId = req.user._id;

    // Now passing `users: [userId]` as an array
    const newProject = await projectService.createProject({ name, users: [userId] });

    res.status(201).json(newProject);
});
