const socket = io.connect('http://localhost:5890')

async function login() {
    const body = {
        acess: document.getElementById("acess").value,
        password: document.getElementById("password").value
    }
    try {
        const response = await fetch("/register/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        const result = await response.json()
        if (response.status !== 200) return alert(result.error)
        socket.emit("setIdUserCipher", result._idCipher)
        window.location.href = result.urlRedirect
    }
    catch (err) {
        console.log(err)
    }
}