const {check} = require("express-validator");

const name = check("name", "Name is required.").not().isEmpty();
const username = check("username", "Name is required.").not().isEmpty();
const email = check("email", "Email is required or Valid Email Address.").isEmail().not().isEmpty();
const password = check("password", "Password is required or minimum length 6 character")
    .not()
    .isEmpty()
    .isLength({
        min: 6
    });

export const RegisterValidation = [name, username, email, password];
export const LoginValidation = [username, password];
