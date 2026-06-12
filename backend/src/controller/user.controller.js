const User = require ("../models/user.model.js");
const Meeting = require("../models/meeting.model");
const bcrypt = require ("bcrypt");
const jwt = require ("jsonwebtoken");
const crypto = require("crypto");

const login = async (req,res)=>{
    const {username,password} = req.body;

    try{
        const user = await User.findOne({username:username});

        if(!user){
            return res.status(401).json({message:"User not exist"});
        }
        
        const entry = await bcrypt.compare(password,user.password);

        if(entry){
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();

            return res.status(200).json({token:token});
        }
        if(!entry){
            return res.status(401).json({message:"Incorrect password"});
        }


        res.status(200).json({
            message:"Login Successful",
            user:{
                name:user.name,
                username:user.username
            }
        });


    }catch(err){
        return res.status(500).json({message:err.message});
    }
}


const register = async (req,res)=>{
    const { name, username, password} = req.body;
    try{
        const user = await User.findOne({username : username});

        if(user){
            return res.status(302).json({message:"User already exist"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User(
            {
                name:name,
                username:username,
                password:hashedPassword
            }
        );

        await newUser.save();
        res.status(201).json({message:"User register Successfully",newUser});

    }catch(err){
        res.status(500).json({message:err.message});
    }
}

const getUserHistory = async (req,res)=>{
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token });
        const meetings = await Meeting.find({ user_id: user.username })

        res.json(meetings)
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token: token });

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        console.log("TOKEN:", token);
console.log("MEETING CODE:", meeting_code);

        res.status(httpStatus.CREATED).json({ message: "Added code to history" })
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}



module.exports= {login,register,getUserHistory,addToHistory};