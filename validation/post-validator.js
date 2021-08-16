import {check} from "express-validator";

const title = check('title', 'Title is required').not().isEmpty();
const content = check('content', 'Content is required').not().isEmpty();

export const postValidator = [title, content];
