import sgMail from '@sendgrid/mail';
import {SENDGRID_API, HOST_EMAIL} from "../config/config";

sgMail.setApiKey(SENDGRID_API);

const sendMail = async (email, subject, text, html) => {
    try {
        const msg = {
            to: email,
            from: HOST_EMAIL,
            subject,
            text,
            html,
        }
        await sgMail.send(msg);
        console.log('Mail Sending')
    } catch (err) {
        console.log("Error Mailing", err.message);
    }finally {
        return
    }
}

export default sendMail;
