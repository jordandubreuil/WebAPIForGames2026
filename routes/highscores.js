const express = require("express");
const HighScore = require("../models/HighScore");

const router = express.Router();

//Post route for adding player scores
router.post("/", async (req, res)=>{
    console.log("Working")
    try{
      const {playername, score, level} = req.body;

      const createdScore = await HighScore.create({playername, score, level});
      
      res.status(201).json({ok:true, createdScore});
        
    }catch(err){
        res.status(400).json({ok:false, error:"Invalid High Score"})
    }
});

//Get route for requesting data from database
router.get("/", async (req,res)=>{
    try{
        const scores = await HighScore.find()
        .sort({score:-1, createdAt:1})
        .limit(10);
        res.json(scores);
    }catch(err){
        res.status(500).json({ok:false, error: "Failed to fetch High Scores"});
    }
});

module.exports = router;