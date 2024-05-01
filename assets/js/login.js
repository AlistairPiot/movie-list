const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");
const errorMessage = document.querySelector(".login .errorMessage");

async function getUsers() {
    try {
        const response = await fetch("http://localhost:3000/users");
        return await response.json();
    } catch (error) {
        console.log("User recovery does not work");
    }
}

async function login() {
    const users = await getUsers();
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const userEmail = email.value;
        const userPwd = password.value;
        users.forEach((user) => {
            if (
                user.email == userEmail &&
                user.password == userPwd &&
                user.admin == true
            ) {
                window.sessionStorage.loged = true;
                window.location.href = "../../index.html";
            } else {
                email.classList.add("inputErrorLogin");
                password.classList.add("inputErrorLogin");
                errorMessage.textContent =
                    "Your email or password are incorrect";
            }
        });
    });
}
login();
