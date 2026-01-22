const scoreList = document.getElementById("scoreList");
const statusDisplay = document.getElementById("status");
const form = document.getElementById("scoreForm");

async function loadScores(){
    scoreList.innerHTML = "";
    statusDisplay.textContent = "Loading Scores...";

    try{
        const res = await fetch("/api/highscores");
        const scores = await res.json();
        
        if(scores.length === 0){
            statusDisplay.textContent = "No scores available";
            return;
        }

        scores.forEach(score => {
            const li = document.createElement("li");
            const deleteBtn= document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.type = "button";

            const editBtn= document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.type = "button";
            
            

            //Add function call
            deleteBtn.addEventListener("click", async ()=>{
                if(!confirm(`Delete ${score.playername}'s score`)){
                    return;
                }
                await deleteScore(score._id);
                loadScores();
            });

            editBtn.addEventListener("click", async ()=>{
               window.location.href = `/edit.html?id=${encodeURIComponent(score._id)}`;
            });

            li.textContent = `${score.playername} - ${score.score} - ${score.level}  | `;
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            scoreList.appendChild(li);
        });

        statusDisplay.textContent = `Loaded ${scores.length} scores.`;

    }catch(err){
        statusDisplay.textContent = "Failed to load scores"
    }
}

form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const playername = document.getElementById("playername").value;
    const score = document.getElementById("score").value;
    const level = document.getElementById("level").value;

    statusDisplay.textContent = "Submitting new score...";

    try{
        await fetch("/api/highscores", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({playername,score,level})
        });

        form.reset();
        loadScores();
    }catch(err){
        statusDisplay.textContent = "Failed to submit score"
    }
});

async function deleteScore(id){
    statusDisplay.textContent = "Deleting...";

    const res = await fetch(`/api/highscores/${id}`, {method:"DELETE"});

    if(!res.ok){
        statusDisplay.textContent = "Delete failed";
    }

    statusDisplay.textContent = "Score Deleted";
}

loadScores();

