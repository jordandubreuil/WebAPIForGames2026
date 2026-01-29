const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if(!JWT_SECRET)throw new Error("Missing JWT Secret");

//Register new users
router.post("/register", async (req,res)=>{
    console.log("Authentication Route", req.body);
    try{
        const {username, password} = req.body;
        console.log("Test");
        if(typeof username !== "string" || typeof password !== "string"){
            return res.status(400).json({ok:false, error:"username and password required"});
        }

        const existing = await User.findOne({username});
        if(existing){
            return res.status(400).json({ok:false, error:"User already exists"});
        }

        const passwordHash = await bcrypt.hash(password, 10);
        console.log(`${username}, ${passwordHash}`);
        await User.create({username, password:passwordHash});

        res.status(201).json({ok:true});
        console.log(`${username}: ${passwordHash}`);
    }catch(err){
        console.log("Register Error:", err);
        res.status(500).json({ok:false, error:"Failed to register new user"});
    }
});

router.post("/login", async (req, res)=>{
    try{
        const {username, password} = req.body;

        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({ok:false, error:"Invalid Credentials"});
        }

        const ok = await bcrypt.compare(password, user.password);

        if(!ok){
            return res.status(401).json({ok:false, error:"Password does not match"});
        }

        const token = jwt.sign({
            sub:user._id.toString(),
            username:user.username,
        },
        JWT_SECRET,
        {expiresIn:"2h"}
        );

        //console.log(token);

        res.json({ok:true, token});

    }catch(err){
        console.log(err);
        res.status(500).json({ok:false, error:"Login Failed"});
    }
});


module.exports = router;