import passport from 'passport';
import {User} from '../models/User';
import {SECRET as secretOrKey} from '../config/config'
import {ExtractJwt, Strategy} from "passport-jwt";


const opts = {
    secretOrKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
    new Strategy(opts, async ({id}, done) => {
        try {
            let user = await User.findById(id);
            if (!user) {
                throw new Error('User Not Found.');
            }
            return done(null, user.getUserInfo());
        } catch (e) {
            return done(null, false);
        }
    }));
