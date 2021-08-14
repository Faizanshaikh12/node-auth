import {Router} from 'express';
import {LoginValidation, RegisterValidation} from "../validation/user-validator";
import Validator from '../middlewares/validation-middleware';
import {User} from '../models/User';
import {randomBytes} from "crypto";
import sendMail from "../functions/email-sender";
import {DOMAIN} from "../config/config"
import {join} from "loadsh";
import path from "path";


const router = Router();

//User Register Apis
router.post('/register', RegisterValidation, Validator, async (req, res) => {
    try {
        let {username, email} = req.body;

        //Check the username is taken or not
        let user = await User.findOne({username});
        if (user) {
            return res.status(400).json({
                message: 'Username is already taken',
                success: false
            })
        }

        //Check existed email address
        user = await User.findOne({email});
        if (user) {
            return res.status(400).json({
                message: 'Email is already exists',
                success: false
            })
        }
        user = new User({
            ...req.body,
            verificationCode: randomBytes(20).toString("hex")
        });
        await user.save();

        //Send the Email verification
        let html = `
<div>
    <h1>Hello, ${user.username}</h1>
    <p>Please click the following link to  verify  your account</p>
    <a href="${DOMAIN}users/verify-now/${user.verificationCode}">Verify Now</a>
    </div>
`;
        await sendMail(user.email, "verify Account", "Please verify your account", html);
        return res.status(201).json({
            success: true,
            message: 'Hey! your account is created please verify your email address.'
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred'
        })
    }

})

//Get Request Send Email Verified Code
router.get('/verify-now/:verificationCode', async (req, res) => {
    try {
        let {verificationCode} = req.params;
        let user = await User.findOne({verificationCode});
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access. Invalid Verification Code"
            })
        }
        user.verified = true;
        user.verificationCode = undefined;
        await user.save();
        // return res.sendFile('verification-success.html', { root: path.join(__dirname, '../templates') });
        // return res.sendFile(join(__dirname, "../templates/verification-success.html"));
        return res.sendFile(path.join(__dirname, '../templates', 'verification-success.html'));
    } catch (err) {
        // return res.sendFile('errors.html', { root: path.join(__dirname, '../templates') });
        return res.sendFile(path.join(__dirname, '../templates', 'errors.html'));
        // return res.sendFile(join(__dirname, "../templates/errors.html"));
        // console.log(err.message);

    }
})

//Post Request User Authenticate!!!!!!!!!!
router.post('/login', LoginValidation, async (req, res) => {
    try {
        let {username, password} = req.body;
        let user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Username Not Found."
            });
        }
        if (!(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password."
            });
        }
        let token = await user.genJwt();
        return res.status(200).json({
            success: true,
            user: user.getUserInfo(),
            token: `Bearer ${token}`,
            message: "Hey, Your Logged In. ."
        });
    } catch (err) {
        // console.log(err.message)
        return res.status(500).json({
            success: false,
            message: 'An error occurred'
        })
    }
})

//Get Request User Profile ----->>>>
router.get('/profile', async (req, res) => {

})


export default router;
