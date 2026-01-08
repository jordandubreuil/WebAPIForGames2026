fetch("/api/data")
    .then(response => response.json())
        .then(data => {
            console.log("Recieved data:", data);
            document.getElementById("name").textContent = data.player;
            document.getElementById("time").textContent = data.timestamp;

            document.getElementById("games").innerHTML = 
            data.games.map(games => `<li>${games}</li>`).join("");
        })
.catch(error =>{
    console.log("Error fetching data: ", error);
    
}
);