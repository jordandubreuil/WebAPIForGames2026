const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

//Location of Routes
const highScoreRoutes = require("./routes/highscores");

//Quick Test that env Variables are available
if(!MONGO_URI){
    console.error("Missing Database Connection");
    process.exit(1);
}

async function connectToMongo(){
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to Database");
    } catch (error) {
        console.error("MongoDB connection error: ", error.message);
        process.exit(1);
    }
}

//Set up static folder for files
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());

//Main Route for Server 
app.get("/", (req,res)=>{
    res.send("The server is running");
});

app.get("/main", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/secondpage", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "secondpage.html"));
});

//JSON data route
app.get("/api/data", (req,res)=>{
    res.json({
        player:"JordanTron",
        timestamp:new Date(),
        games:["Fortnite", "Arc Raiders", "Portal2"]
    });
});

//JSON via data file
app.get("/api/games", (req,res)=>{
    fs.readFile("data.json", "utf-8", (err,data)=>{
        if(err){
            res.status(500).json({error:"Failed to read data file"});
            return;
        }
        //Send the actual data
        res.json(JSON.parse(data));
    });
});

let leaderboard = [
    {player:"Corey", score:1200},
    {player:"Nate", score:1100}
]

//Post request example
app.post("/leaderboard", (req,res)=>{
    console.log(req.body);
    const {player, score} = req.body;

    //basic validation
    if(typeof player != "string" || typeof score != "number"){
        return res.status(400).json({
            ok:false,
            error:"Expected JSON body: {player:string, score:number}"
        });
    }
    
    //Add leader to scoreboard
    leaderboard.push({player,score});

    //sort the scores
    leaderboard.sort((a,b)=>b.score -a.score);

    console.log(leaderboard);
    res.status(201).json({ok:true, leaderboard});
});

//Requests using MongoDB Database and Mongoose
const gameSchema = new mongoose.Schema({},{strict:false});
const VideoGameData = mongoose.model("gameprofiles", gameSchema);

app.get("/api/gamesprofile", async (req,res)=>{
    const games = await VideoGameData.find();
    console.log(games);
    res.json(games);
});

app.get("/api/gamesprofile/:game", async (req,res)=>{
    const game = req.params.game;
    const gameentry = await VideoGameData.findOne({game});
    console.log(gameentry);
    res.json(gameentry);
});

//Connecting with a router module - Week 3
app.use("/api/highscores", highScoreRoutes);


//Command that starts the server
// app.listen(PORT, ()=>{
//     console.log(`Running on port: ${PORT}`);
// });

//Connection with Database and Sever
connectToMongo().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Running on port: ${PORT}`);
    });
})