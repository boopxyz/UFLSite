async function togglePassword() {
    var passInput = document.getElementById("password")
    
    if(passInput.type === "password") {
        passInput.type = "text"
    } else {
        passInput.type = "password"
    }
}