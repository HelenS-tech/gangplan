const welcomeScreen = document.getElementById("welcomeScreen");
const createGangScreen = document.getElementById("createGangScreen");
const createGangBtn = document.getElementById("createGangBtn");
const backToWelcome = document.getElementById("backToWelcome");
const createGangForm = document.getElementById("createGangForm");
const gangDashboard = document.getElementById("gangDashboard");
const boardScreen = document.getElementById("boardScreen");
const noteFormScreen = document.getElementById("noteFormScreen");

const openBoardBtn = document.getElementById("openBoardBtn");
const navBoardBtn = document.getElementById("navBoardBtn");
const backToDashboard = document.getElementById("backToDashboard");

const addNoteBtn = document.getElementById("addNoteBtn");
const cancelNoteBtn = document.getElementById("cancelNoteBtn");
const noteForm = document.getElementById("noteForm");

const notesContainer = document.getElementById("notesContainer");

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

    createGangScreen.classList.add("hidden");
    gangDashboard.classList.remove("hidden");

    document.getElementById("dashboardGangName").textContent = gangName;
    document.getElementById("dashboardWelcome").textContent =
        `Welcome, ${yourName}!`;
});

function openBoard() {
    gangDashboard.classList.add("hidden");
    boardScreen.classList.remove("hidden");

    const gangName = document.getElementById("dashboardGangName").textContent;
    document.getElementById("boardGangName").textContent = `${gangName} Board`;
}

openBoardBtn.addEventListener("click", openBoard);
navBoardBtn.addEventListener("click", openBoard);

backToDashboard.addEventListener("click", () => {
    boardScreen.classList.add("hidden");
    gangDashboard.classList.remove("hidden");
});

addNoteBtn.addEventListener("click", () => {
    boardScreen.classList.add("hidden");
    noteFormScreen.classList.remove("hidden");
});

cancelNoteBtn.addEventListener("click", () => {
    noteFormScreen.classList.add("hidden");
    boardScreen.classList.remove("hidden");
});