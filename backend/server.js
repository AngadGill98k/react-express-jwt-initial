const express=require("express");
const path=require("path");
const app=express();
const PORT=3001


const http=require("http")
const server=http.createServer(app)
const {Server}=require("socket.io")
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});


io.on('connection',(socket)=>{
  console.log("user connected");
  console.log(socket.id);


  
  socket.on('disconnect',()=>{
    console.log("user disconnected");
  })
})


app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));


const bcrypt=require("bcrypt");
const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/testing")
    .then(()=>{
        console.log("db connected");
    })
    .catch((err)=>{
        console.log(err);
    })
let User=require("./models/User");








const cors=require("cors");
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_jwt_secret_key';


passport.use(new LocalStrategy({
  usernameField: 'mail',
  passwordField: 'pass'
},async (mail, pass, done) => {
  const user = await User.findOne({ mail });
  if (!user) return done(null, false, { message: 'Incorrect username.' });
  const hashedpass=await bcrypt.compare(pass,user.pass);
  if (!hashedpass) return done(null, false, { message: 'Incorrect password.' });
  return done(null, user);
}));



const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
};
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  const user = users.find(u => u.id === jwt_payload.id);
  if (user) {
    return done(null, user);
  } else {
    return done(null, false);
  }
}));


app.use(passport.initialize());



const multer=require("multer");
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads");
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now()+file.originalname);
    }
})
const upload=multer({storage:storage});


app.use('/uploads', express.static('uploads'));








app.post('/signin', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: info.message || 'Login failed' });
    }
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    return res.json({ message: 'Login successful', token });

  })(req, res, next);

});

app.post('/signup', async (req, res) => {
  try {
    const { name,pass,mail } = req.body;
    const hashedpass = await bcrypt.hash(pass, 10);
    const user = new User({ name,pass:hashedpass,mail });
    await user.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ error: err.message,msg:false }); 
  }
});

app.post('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send('Logout error');
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.send('Logged out');
    });
  });
});

//use this is proected routes passport.authenticate('jwt', { session: false }),

server.listen(3001,()=>{
    console.log("server started");
})