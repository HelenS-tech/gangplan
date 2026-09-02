const SUPABASE_URL = "https://velesgbkpfjiiaixmuiq.supabase.co";
const SUPABASE_KEY = "sb_publishable_X-EOyvGZ-2el_h7EZFT_Vg_mWYzw76w";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
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

createGangForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const gangName = document.getElementById("gangName").value;
  const yourName = document.getElementById("yourName").value;

  const { data, error } = await supabaseClient
    .from("gangs")
    .insert([
      {
        name: gangName,
        created_by: yourName
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating gang:", error);
    alert("There was a problem creating your gang.");
    return;
  }

  console.log("Gang created:", data);

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