import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import bcrypt from "bcrypt";

export const SECRET_KEY = 'your_jwt_secret_key';

const localstrat=new LocalStrategy({
  usernameField: 'mail',
  passwordField: 'pass'
},async (mail, pass, done) => {
  const user = await User.findOne({ mail });
  if (!user) return done(null, false, { message: 'Incorrect username.' });
  const hashedpass=await bcrypt.compare(pass,user.pass);
  if (!hashedpass) return done(null, false, { message: 'Incorrect password.' });
  return done(null, user);
})
    

passport.use(localstrat);



const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
};
const Jwtstart=new JwtStrategy(opts, async(jwt_payload, done) => {
  const user = await User.findById(jwt_payload.id);
  if (user) {
    return done(null, user._id);
  } else {
    return done(null, false);
  }
})
passport.use(Jwtstart);



export {passport};
