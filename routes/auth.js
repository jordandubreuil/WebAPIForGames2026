const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if(!JWT_SECRET)throw new Error("Missing JWT Secret");

//Register new users
router.post("/register", async (req,res)=>{
    console.log("Authentication Route")
    try{
        const {username, password} = req.body;

        if(typeof username !== "string" || typeof password !== "string"){
            return res.status(400).json({ok:false, error:"username and password required"});
        }

        const existing = await User.findOne({username});
        if(existing){
            return res.status(400).json({ok:false, error:"User already exists"});
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await User.create({username, passwordHash});

        res.status(201).json({ok:true});
        console.log(`${username}: ${passwordHash}`);
    }catch{
        res.status(500).json({ok:false, error:"Failed to register new user"});
    }
});


module.exports = router;