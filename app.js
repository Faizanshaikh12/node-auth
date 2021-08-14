import express from 'express'
import {json} from "body-parser";
import {DB, PORT} from "./config/config";
import mongoose from "mongoose";

//Router Export
import userRouter from './routes/users';

//Initialize the Express
const app = express()

//Body Parser MiddleWare
app.use(json())

//Inject router and apis
app.use('/users', userRouter)

//Main function part
const main = async () => {
    try {
        await mongoose.connect(DB, {
            useFindAndModify: true,
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }, () => {
            console.log('Database Connected....')});

        app.listen(process.env.APP_PORT, () => {
            console.log(`Server Started on Port ${process.env.APP_PORT}`);
        })
    } catch (err) {
        console.log(`Unable to start the server \n${err.message}`)
    }
}
main();

