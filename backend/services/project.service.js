import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createProject = async ({ name, users }) => {
    if (!name) {
        throw new ApiError(400, 'Project name is required');
    }
    if (!users || users.length === 0) {
        throw new ApiError(400, 'Project users are required');
    }

    let project;

    try {
        // Check if a project with the same name already exists
        const existingProject = await Project.findOne({ name });
        if (existingProject) {
            throw new ApiError(400, 'Project with this name already exists');
        }

        // Attempt to create a new project
        project = await Project.create({
            name,
            users
        });
    } catch (error) {
        // Handle other errors
        throw error;
    }

    return project;
};
