import {Router} from "express";
import {uploadPostImage as uploader} from "../middlewares/uploader";
import {userAuth} from "../middlewares/auth-middleware";
import {postValidator} from "../validation/post-validator";
import Validator from "../middlewares/validation-middleware"
import {DOMAIN} from "../config/config";
import {Post} from "../models/Post";
import SlugGenerator from "../functions/slug-gen";

const router = Router();

/**
 * POST Request
 * Upload the Post Image With Authenticate User
 * Private Access
 */
router.post('/post-image-upload', userAuth, uploader.single('image'), async (req, res) => {
    try {
        let {file} = req;
        console.log(file)
        let filename = DOMAIN + 'post-images/' + file.filename
        return res.status(200).json({
            success: true,
            filename,
            message: 'Image Uploaded Successfully'
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: 'Unable to create the post'
        })
    }
});


/**
 * POST Request
 * Create a New Post With Authenticate User
 * Private Access
 */
router.post('/create-post', userAuth, postValidator, Validator, async (req, res) => {
    try {
        let {body} = req;
        let post = new Post({
            author: req.user.id,
            ...body,
            slug: SlugGenerator(body.title)
        });
        await post.save();
        return res.status(201).json({
            post,
            success: true,
            message: 'Post is Published'
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: 'Unable to create the post'
        })
    }
});

/**
 * PUT Request
 * Update Post With Authenticate User
 * Private Access
 */
router.put('/update-post/:id', userAuth, postValidator, Validator, async (req, res) => {
    try {
        let {id} = req.params;
        let {user, body} = req;
        let post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found.'
            })
        }
        if (post.author.toString() !== user.id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Post does not belong to you.'
            })
        }
        post = await Post.findOneAndUpdate(
            {author: user.id, _id: id},
            {
                ...body,
                slug: SlugGenerator(body.title),
            },
            {new: true}
        );
        return res.status(201).json({
            post,
            success: true,
            message: 'Post Updated Successfully'
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: 'Unable to update the post'
        })
    }
});

/**
 * PUT Request
 * Post Likes Functionality With Authenticate User
 * Private Access
 */
router.put('/like-post/:id', userAuth, async (req, res) => {
    try {
        let {id} = req.params;
        let post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found.'
            })
        }

        let user = post.likes.user.map((_id) => _id.toString());
        if(user.includes(req.user.id.toString())){
            return res.status(404).json({
                success: false,
                message: 'Post already like this.'
            })
        }

        post = await Post.findOneAndUpdate(
            {_id: id},
            {
                likes: {
                    count: post.likes.count + 1,
                    user: [...post.likes.user, req.user.id],
                },
            },
            {new: true}
        );
        return res.status(201).json({
            success: true,
            message: 'You like this post'
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: 'Unable like a post. please try again later'
        })
    }
});

export default router;
