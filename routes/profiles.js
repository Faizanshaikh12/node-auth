import {Router} from "express";
import {userAuth} from "../middlewares/auth-middleware";
import uploader from "../middlewares/uploader";
import {Profile} from "../models/Profile";
import {DOMAIN} from "../config/config";
import {User} from "../models/User";

const router = Router();

/**
 * POST <MultiPartForm> Request
 * Create User Profile With Authenticate
 * Private Access
 */
router.post('/create-profile', userAuth, uploader.single('avatar'), async (req, res) => {
    try {
        let {body, file, user} = req;
        let path = DOMAIN + file.path.split('uploads')[1];
        let profile = new Profile({
            social: body,
            account: user.id,
            avatar: path,
        })
        await profile.save();
        return res.status(201).json({
            success: true,
            message: 'Profile Created Successfully'
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: 'Unable Created Profile'
        })
    }
})

/**
 * GET <MultiPartForm> Request
 * fetch User Profile With Authenticate
 * Private Access
 */
router.get('/my-profile', userAuth, async (req, res) => {
    try {
        let profile = await Profile.findOne({account: req.user.id}).populate(
            "account",
            "name email username"
        );
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Your Profile Not Available'
            })
        }
        return res.status(200).json({
            success: true,
            profile
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: 'Unable Get Profile'
        })
    }
})

/**
 * PUT <MultiPartForm> Request
 * Update User Profile With Authenticate
 * Private Access
 */
router.put('/update-profile', userAuth, uploader.single('avatar'), async (req, res) => {
    try {
        let {body, file, user} = req;
        let path = DOMAIN + file.path.split('uploads')[1];
        let profile = await Profile.findOneAndUpdate(
            {account: user.id},
            {social: body, avatar: path},
            {new: true}
        );
        return res.status(200).json({
            success: true,
            message: 'Your Profile Now Updated',
            profile
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: 'Unable get the Profile'
        })
    }
})

/**
 * GET Request
 * User Profile With Username
 * Private Access
 */
router.get('/user-profile/:username', async (req, res) => {
    try {
        let {username} = req.params;
        let user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found."
            });
        }
        let profile = await Profile.findOne({account: user.id});
        return res.status(200).json({
            profile : {
                ...profile.toObject(),
                account: user.getUserInfo()
            },
            success: true,
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong.'
        })
    }
})
export default router;
