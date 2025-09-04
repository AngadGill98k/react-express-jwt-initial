import jwt from "jsonwebtoken";
import passport from "passport";

import { SECRET_KEY } from "../auth.js"

import User from "../models/User.js"
import bcrypt from "bcrypt";

export const signin = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: info.message || 'Login failed' });
    }
    const payload = { id: user.id, username: user.username };
    const ref_token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    const access_token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1d' });
    res.cookie("token", ref_token, {
      httpOnly: true,      
      secure: true,        
      sameSite: "Strict",  
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.json({ message: 'Login successful', access_token });
  })(req, res, next);
}

export const signup = (async (req, res, next) => {
  try {
    const { name, pass, mail } = req.body;
    const hashedpass = await bcrypt.hash(pass, 10);
    const user = new User({ name, pass: hashedpass, mail });
    await user.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ error: err.message, msg: false });
  }
})

export const refresh=async(req,res,next)=>{
  const token = req.cookies.token;
  if(!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    const access_token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1d' });
    res.json({ message: 'Token refreshed', access_token,msg:true });
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

export const logout = (req, res) => {
  //   req.logout(err => {
  //     if (err) return res.status(500).send('Logout error');
  //     req.session.destroy(() => {
  //       res.clearCookie('connect.sid');
  //       res.send('Logged out');
  //     });
  //   });
}