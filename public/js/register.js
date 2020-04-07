async function login() {
    const body = {}
    body.user = document.getElementById("user").value
    body.password = document.getElementById("password").value
    try {
        await fetch("/register/login", { 
            method: "POST", 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body) 
        })
    }
    catch (err) {
        alert(err)
    }
}