const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 3000;

//Set up static folder for files
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());

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

//Command that starts the server
app.listen(PORT, ()=>{
    console.log(`Running on port: ${PORT}`);
});