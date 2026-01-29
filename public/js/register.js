document.getElementById("regForm").addEventListener("submit", async (e)=>{
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    console.log(username, password);
    const res = await fetch("/api/auth/register", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username, password})
    });
    console.log(res);
    const data = await res.json();
    console.log(data);
    if(!res.ok){
        document.getElementById("status").textContent = data.error || "Registration Failed";
        return;
    }

    window.location.href = "/login.html";
});