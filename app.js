const SUPABASE_URL = "https://velesgbkpfjiiaixmuiq.supabase.co";
const SUPABASE_KEY = "sb_publishable_X-EOyvGZ-2el_h7EZFT_Vg_mWYzw76w";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
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

const logoutBtn = document.getElementById("logoutBtn");

const loginBtn = document.getElementById("loginBtn");
const loginScreen = document.getElementById("loginScreen");
const backFromLogin = document.getElementById("backFromLogin");
const loginForm = document.getElementById("loginForm");

let currentGangId = localStorage.getItem("currentGangId");

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
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data: authData, error: authError } = await supabaseClient.auth.signUp(
    {
      email: email,
      password: password,
    },
  );

  if (authError) {
    console.error("Error creating account:", authError);
    alert(authError.message);
    return;
  }

  console.log("User created:", authData);

  const { data, error } = await supabaseClient
    .from("gangs")
    .insert([
      {
        name: gangName,
        created_by: yourName,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating gang:", error);
    alert("There was a problem creating your gang.");
    return;
  }

  const userId = authData.user.id;

  const { error: memberError } = await supabaseClient
    .from("gang_members")
    .insert([
      {
        gang_id: data.id,
        user_id: userId,
        display_name: yourName,
        role: "owner",
      },
    ]);

  if (memberError) {
    console.error("Error creating gang membership:", memberError);
    alert(
      "Your gang was created, but there was a problem adding you as a member.",
    );
    return;
  }

  currentGangId = data.id;

  localStorage.setItem("currentGangId", data.id);
  localStorage.setItem("currentGangName", gangName);
  localStorage.setItem("currentUserName", yourName);

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

  const gangName = document.getElementById("dashboardGangName").textContent;

  document.getElementById("boardGangName").textContent = `${gangName} Board`;

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

const noteColours = ["blue-note", "green-note", "purple-note", "yellow-note"];

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
        note_text: noteText,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating note:", error);
    alert("There was a problem posting your note.");
    return;
  }

  const note = document.createElement("article");

  note.classList.add("note-card", noteColours[nextColour]);

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

async function restoreGang() {
  const savedGangId = localStorage.getItem("currentGangId");
  const savedGangName = localStorage.getItem("currentGangName");
  const savedUserName = localStorage.getItem("currentUserName");

  if (!savedGangId) {
    return;
  }

  currentGangId = savedGangId;

  welcomeScreen.classList.add("hidden");
  createGangScreen.classList.add("hidden");
  gangDashboard.classList.remove("hidden");

  document.getElementById("dashboardGangName").textContent = savedGangName;
  document.getElementById("dashboardWelcome").textContent =
    `Welcome, ${savedUserName}!`;
}

restoreGang();

loginBtn.addEventListener("click", () => {
  welcomeScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
});

backFromLogin.addEventListener("click", () => {
  loginScreen.classList.add("hidden");
  welcomeScreen.classList.remove("hidden");
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentGangId");
  localStorage.removeItem("currentGangName");
  localStorage.removeItem("currentUserName");

  currentGangId = null;

  gangDashboard.classList.add("hidden");
  boardScreen.classList.add("hidden");
  noteFormScreen.classList.add("hidden");
  createGangScreen.classList.add("hidden");

  welcomeScreen.classList.remove("hidden");
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const { data: loginData, error: loginError } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

  if (loginError) {
    console.error("Login error:", loginError);
    alert("Unable to log in. Please check your email and password.");
    return;
  }

  const userId = loginData.user.id;

  const { data: membership, error: membershipError } = await supabaseClient
    .from("gang_members")
    .select(
      `
        gang_id,
        display_name,
        gangs (
          name
        )
      `,
    )
    .eq("user_id", userId)
    .single();

  if (membershipError) {
    console.error("Membership lookup error:", membershipError);
    alert("We couldn't find your gang membership.");
    return;
  }

  currentGangId = membership.gang_id;

  const gangName = membership.gangs.name;
  const userName = membership.display_name;

  localStorage.setItem("currentGangId", currentGangId);
  localStorage.setItem("currentGangName", gangName);
  localStorage.setItem("currentUserName", userName);

  loginScreen.classList.add("hidden");
  gangDashboard.classList.remove("hidden");

  document.getElementById("dashboardGangName").textContent = gangName;
  document.getElementById("dashboardWelcome").textContent =
    `Welcome, ${userName}!`;
});
