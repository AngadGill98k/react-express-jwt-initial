import mongoose from "../db.js"

const userschema=new mongoose.Schema({
    name:String,
    mail:String,
    pass:String,
   
})
const User=mongoose.model('User',userschema)
export default User