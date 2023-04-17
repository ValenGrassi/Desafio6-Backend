const registerForm = document.querySelector("#registerForm")

if (registerForm instanceof HTMLFormElement) {
    registerForm.addEventListener("submit", async event => {
        event.preventDefault()
        const data = new FormData(registerForm)
        const obj = {}
        data.forEach((value, key) => obj[key] = value)
        const response = await fetch("/api/sessions/register", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        })
        
        if (response.status === 201){
        window.location.replace("/")}
    })
}