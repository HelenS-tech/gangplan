const welcomeScreen = document.getElementById("welcomeScreen");
const createGangScreen = document.getElementById("createGangScreen");
const createGangBtn = document.getElementById("createGangBtn");
const backToWelcome = document.getElementById("backToWelcome");
const createGangForm = document.getElementById("createGangForm");

createGangBtn.addEventListener("click", () => {
    welcomeScreen.classList.add("hidden");
    createGangScreen.classList.remove("hidden");
});

backToWelcome.addEventListener("click", () => {
    createGangScreen.classList.add("hidden");
    welcomeScreen.classList.remove("hidden");
});

createGangForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const gangName = document.getElementById("gangName").value;
    const yourName = document.getElementById("yourName").value;

    console.log("Gang created:", gangName);
    console.log("Created by:", yourName);

    alert(`${gangName} has been created!`);
});