const express = require("express");
const HighScore = require("../models/HighScore");

const router = express.Router();

//Post route for adding player scores
router.post("/", async (req, res)=>{
    //console.log("Working")
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
    //console.log("fetching scores")
    try{
        const scores = await HighScore.find()
        .sort({score:-1, createdAt:1})
        .limit(10);
        res.json(scores);
        //console.log(scores);
    }catch(err){
        res.status(500).json({ok:false, error: "Failed to fetch High Scores"});
    }
});

//Delete route (Deletes by id)
router.delete("/:id", async (req,res)=>{
    try{
        const {id} = req.params;
        const deleted = await HighScore.findByIdAndDelete(id);

        if(!deleted){
            return res.status(404).json({ok:false, error:"Score not found"})
        }

        res.json({ok:true, deletedId:id});

    }catch(err){
        res.status(400).json({ok:false, error:"Delete failed"});
    }
});

//get rout for the edit page
router.get("/:id", async (req,res)=>{
    //console.log("fetch for edit");
    try{
        const score = await HighScore.findById(req.params.id);

        if(!score){
            return res.status(404).json({ok:false, error:"Not found"})
        }
        //console.log(score);
        res.json(score);
    }catch{
        return res.status(400).json({ok:false, error:"Invalid Id"});
    }
});


///======Next week need to add PUT route  for update

router.put("/:id", async (req,res)=>{
    console.log(req.body)
    try{

        //Update High Score Entry
        const {id} = req.params;

        
        //Only allow expected fields
        const payload = {};
        if(typeof req.body.playername === "string"){
            payload.playername = req.body.playername;
        }

        if(typeof req.body.score === "number"){
            payload.score = req.body.score;
        }

        if(typeof req.body.level === "number"){
            payload.level = req.body.level;
        }

        const updatedEntry = await HighScore.findByIdAndUpdate(id,payload,{
            new:true,
            runValidators:true
        });

        if(!updatedEntry){
            res.status(404).json({ok:false, error:"Score Entry not found"});
        }
        res.json({ok:true, updatedEntry});
        //res.redirect("/api/highscores.html");
    }catch(err){
        res.status(400).json({ok:false, error:"Update Failed"});
    }
});

module.exports = router;