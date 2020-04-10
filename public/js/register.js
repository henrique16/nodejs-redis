const socket = io.connect('http://localhost:5890')

async function login() {
    const body = {}
    body.acess = document.getElementById("acess").value
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