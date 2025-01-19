import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import redis from "../services/redis.service.js";


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        console.log(user);

        const accessToken = await user.generateaccesstoken()
        const refreshToken = await user.generaterefreshtoken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        console.log(accessToken, refreshToken);

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")


    }
}
const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for empty fields
    if ([email, password].some((fields) => fields?.trim() === "")) {
        throw new ApiError(400, "All fields required");
    }


    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(402, "User already exists with this email");
    }

    // Create the user with the email and password in an object
    const user = await User.create({
        email,
        password
    });

    // Fetch the created user without password and refreshToken fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // If the user creation fails, throw an error
    if (!createdUser) {
        throw new ApiError(500, "Server failure !!");
    }

    // Return the created user in the response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    //req body -> data
    //username or email
    //find the user
    //password check
    //access and refresh token genarate
    //send cookies  containing tokens

    //bringing data
    const { email, password } = req.body

    if (!email) {
        throw new ApiError(400, "email is required")
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Password invalid")
    }



    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refershToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User LoggedIn Successfully"
            )
        )
})

const userProfile = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unthorized access")
    }

    const user = req.user

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user
                },
                "User profile fetched Successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {

    /*      since we can't give a form to user to give details and
            we want access to user to create a middleware auth to 
            authenticate login and add user to req.body
    */

    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    redis.set(token, 'logout', 'EX', 60 * 60 * 24);


    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

export {
    registerUser,
    loginUser,
    userProfile,
    logoutUser
};
