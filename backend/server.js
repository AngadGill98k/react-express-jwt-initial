import express from "express";
import path from "path";
const app=express();
const PORT=3001


import http from "http";
const server=http.createServer(app)
import { Server } from "socket.io";

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
import socketHandler from "./sockets.js";
socketHandler(io);
 




app.use(express.json());
// app.use(express.static(path.join(__dirname,"public")));










import cors from "cors";
import cookieParser from "cookie-parser";
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(cookieParser());



import {passport} from "./auth.js"
app.use(passport.initialize());



import multer from "multer";
import storage from "./multer.js";
const upload=multer({storage:storage});


app.use('/uploads', express.static('uploads'));







import {refresh,signin,signup,logout} from "./controllers/login.js"
app.get('/refresh',refresh)

app.post('/signin', signin);

app.post('/signup', signup);

app.post('/logout', logout);

//use this is proected routes passport.authenticate('jwt', { session: false }),

server.listen(PORT,()=>{
    console.log("server started");
})
