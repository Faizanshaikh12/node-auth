import multer from 'multer';

const filename = (req, file, next) => {
    //Something .jpg/.png
    let lastIndexof = file.originalname.lastIndexOf(".");
    let ext = file.originalname.substring(lastIndexof);
    next(null, `img-${Date.now()}${ext}`);
}

//image destination
const destination = (req, file, next) => {
    next(null, `${__dirname}/../uploads`);
}

//Post Image destination
const postImageDestination = (req, file, next) => {
    next(null, `${__dirname}/../uploads/post-images`)
}

export const uploadPostImage = multer({
    storage: multer.diskStorage({ destination: postImageDestination, filename}),
})

const upload = multer({
    storage: multer.diskStorage({destination, filename}),
})

export default upload;
