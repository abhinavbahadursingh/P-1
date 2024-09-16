import { asyncHandler } from "../utils/async.handeler.js";
import { ApiError } from "../utils/apiError.js";
import {User} from "../models/user.models.js"
import { application } from "express";
import { uplodeOnCloudinary } from "../utils/cloudinary.js";
import { apiResronse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async(req, res)=>{
    //get details from user
    //validation --not empty --email correct
    //check weather already exist: userName and email
    //check for images 
    //check for avatar
    //upload them to cloudinary , avatar
    //create user object - create entry in db
    //remove pass and refresh token field from user
    //check for creation
    //return res


    const {fullname, email, username, password}=req.body
    console.log("email::",email);

    if(
        [fullname,email,username,password].some((field)=>
        field?.trim()==="")
    ){
        throw new ApiError (400 , "all fields are required")
    }
    
    const existedUser = User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409, "user with email or usernam already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverIamgeLocalPath = req.files?.coverIamge[0]?.path;


    if(!avatarLocalPath){
        throw new ApiError(400, "avatar file is required")
    }



    const avatar = await uplodeOnCloudinary(avatarLocalPath)
    const converImage = await uplodeOnCloudinary(coverIamgeLocalPath)

    if(!avatar){
        throw new ApiError(400, "avatar file is required")
        
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverIamge: converImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "something went wrong while creating the user")
    }


    return res.status(201).jason(
        new ApiResronse(200, createdUser, " user registered succ.")
    )

})

export {registerUser}
