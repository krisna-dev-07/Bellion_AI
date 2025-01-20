import mongoose from "mongoose";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createProject = async ({ name, users }) => {
    if (!name) {
        throw new ApiError(400, "Project name is required");
    }
    if (!Array.isArray(users) || users.length === 0) {
        throw new ApiError(400, "Project users are required");
    }
    if (users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new ApiError(400, "Invalid userId(s) in users array");
    }

    const existingProject = await Project.findOne({ name });
    if (existingProject) {
        throw new ApiError(400, "Project with this name already exists");
    }

    return await Project.create({ name, users });
};

export const getAllProjectsByUserId = async ({ userId }) => {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(401, "Valid userId is required");
    }

    return await Project.find({ users: userId });
};

export const addUserToProject = async ({ projectId, users, userId }) => {
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Valid projectId is required");
    }
    if (!Array.isArray(users) || users.some(id => !mongoose.Types.ObjectId.isValid(id))) {
        throw new ApiError(400, "Invalid userId(s) in users array");
    }
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Valid userId is required");
    }

    const project = await Project.findOne({ _id: projectId, users: userId });
    if (!project) {
        throw new ApiError(401, "User is not a part of the project");
    }

    const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId },
        { $addToSet: { users: { $each: users } } },
        { new: true }
    );

    return updatedProject;
};

export const getProjectById = async ({ projectId }) => {
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Valid projectId is required");
    }

    const project = await Project.findOne({ _id: projectId }).populate("users");
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return project;
};
