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

let currentGangId = null;

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

  currentGangId = data.id;

  createGangScreen.classList.add("hidden");
  gangDashboard.classList.remove("hidden");

  document.getElementById("dashboardGangName").textContent = gangName;
  document.getElementById("dashboardWelcome").textContent =
    `Welcome, ${yourName}!`;
});

async function loadNotes() {
  const { data, error } = await supabaseClient
    .from("notes")
    .select("*")
    .eq("gang_id", currentGangId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading notes:", error);
    return;
  }

  notesContainer.innerHTML = "";

  data.forEach((savedNote, index) => {
    const note = document.createElement("article");

    const colourClass = noteColours[index % noteColours.length];

    note.classList.add("note-card", colourClass);

    const createdDate = new Date(savedNote.created_at);

    note.innerHTML = `
      <div class="note-top">
        <strong>${savedNote.author}</strong>
        <span>${createdDate.toLocaleDateString()}</span>
      </div>

      <p>${savedNote.note_text}</p>
    `;

    notesContainer.appendChild(note);
  });
}

async function openBoard() {
  gangDashboard.classList.add("hidden");
  boardScreen.classList.remove("hidden");

  const gangName =
    document.getElementById("dashboardGangName").textContent;

  document.getElementById("boardGangName").textContent =
    `${gangName} Board`;

  await loadNotes();
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

const noteColours = [
  "blue-note",
  "green-note",
  "purple-note",
  "yellow-note"
];

let nextColour = 0;

noteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const noteText = document.getElementById("noteText").value;
  const yourName = document.getElementById("yourName").value;

  const { data, error } = await supabaseClient
    .from("notes")
    .insert([
      {
        gang_id: currentGangId,
        author: yourName,
        note_text: noteText
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating note:", error);
    alert("There was a problem posting your note.");
    return;
  }

  const note = document.createElement("article");

  note.classList.add(
    "note-card",
    noteColours[nextColour]
  );

  note.innerHTML = `
    <div class="note-top">
      <strong>${data.author}</strong>
      <span>Just now</span>
    </div>

    <p>${data.note_text}</p>
  `;

  notesContainer.prepend(note);

  nextColour = (nextColour + 1) % noteColours.length;

  noteForm.reset();

  noteFormScreen.classList.add("hidden");
  boardScreen.classList.remove("hidden");
});