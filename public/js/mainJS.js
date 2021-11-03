async function togglePassword() {
    var passInput = document.getElementById("password")
    
    if(passInput.type === "password") {
        passInput.type = "text"
    } else {
        passInput.type = "password"
    }
}

function popuphandler(flag) {
    if (flag) {
        document.getElementById("popup").classList.remove("hidden");
    } else {
        document.getElementById("popup").classList.add("hidden");
    }
}