import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";


dotenv.config({
    path: './env'
})



connectDB()
.then(()=>{
    app.on("error" , (error)=>{
        console.log("ERROR : ", error)
        throw error
   })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`the server is running at prot:: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGODB is facing error in connecting....",err)
})

/*

import express from 'express';

const app = express()

(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error" , (error)=>{
            console.log("ERROR : ", error),
            throw error
       })
       app.listen(process.env.PORT , ()=>{
        console.log(`app is listining at port ${process.env.PORT}`);
       })
        throw error
    } catch (error) {
        console.error(`Errror : ${error}`)
        throw error
    }
})()

*/
