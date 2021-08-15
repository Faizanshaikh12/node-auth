import express from 'express'
import {json} from "body-parser";
import {DB, PORT} from "./config/config";
import mongoose from "mongoose";
import passport from "passport";

//Router Export
import userAPi from './routes/users';
import profilesApi from "./routes/profiles";
import {join} from "path";

//Passport Middleware
require('./middlewares/passport-middleware')

//Initialize the Express
const app = express()

//Body Parser MiddleWare
app.use(json());
app.use(passport.initialize());
app.use(express.static(join(__dirname, './uploads')));

//Inject router and apis
app.use('/users', userAPi)
app.use('/profiles', profilesApi)

//Main function part
const main = async () => {
    try {
        await mongoose.connect(DB, {
            useFindAndModify: false,
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

