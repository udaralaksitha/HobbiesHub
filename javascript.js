const defaultHobbies = [
  {
    id: "painting",
    name: "Painting",
    category: "Creative",
    emoji: "🎨",
    tone: "tone-peach",
    description:
      "Express your imagination with colors, brushes, and your own unique creations.",
    time: "30–60 min",
    level: "Beginner friendly",
  },
  {
    id: "photography",
    name: "Photography",
    category: "Creative",
    emoji: "📸",
    tone: "tone-blue",
    description:
      "Capture beautiful moments and discover the world through a different lens.",
    time: "Flexible",
    level: "Beginner friendly",
  },
  {
    id: "gardening",
    name: "Gardening",
    category: "Outdoor",
    emoji: "🪴",
    tone: "tone-green",
    description:
      "Grow flowers, herbs, or vegetables and enjoy nurturing something of your own.",
    time: "15–30 min",
    level: "Beginner friendly",
  },
  {
    id: "hiking",
    name: "Hiking",
    category: "Outdoor",
    emoji: "🥾",
    tone: "tone-green",
    description:
      "Explore nature trails, enjoy fresh air, and discover breathtaking views.",
    time: "1–2 hours",
    level: "Some experience",
  },
  {
    id: "cycling",
    name: "Cycling",
    category: "Fitness",
    emoji: "🚴",
    tone: "tone-blue",
    description:
      "Stay active, explore your surroundings, and enjoy a refreshing ride.",
    time: "30–60 min",
    level: "Beginner friendly",
  },
  {
    id: "yoga",
    name: "Yoga",
    category: "Fitness",
    emoji: "🧘",
    tone: "tone-purple",
    description:
      "Build flexibility, practice mindful movement, and find your balance.",
    time: "15–30 min",
    level: "Beginner friendly",
  },
  {
    id: "reading",
    name: "Reading",
    category: "Relaxation",
    emoji: "📚",
    tone: "tone-yellow",
    description:
      "Escape into stories, explore new ideas, and learn something every day.",
    time: "15–30 min",
    level: "Beginner friendly",
  },
  {
    id: "journaling",
    name: "Journaling",
    category: "Relaxation",
    emoji: "📔",
    tone: "tone-pink",
    description:
      "Write down your thoughts, reflect on your day, and celebrate small wins.",
    time: "15–30 min",
    level: "Beginner friendly",
  },
  {
    id: "cooking",
    name: "Cooking",
    category: "Creative",
    emoji: "🍳",
    tone: "tone-yellow",
    description:
      "Experiment with recipes, discover new flavors, and prepare delicious meals.",
    time: "30–60 min",
    level: "Beginner friendly",
  },
  {
    id: "music",
    name: "Playing Music",
    category: "Creative",
    emoji: "🎸",
    tone: "tone-purple",
    description:
      "Learn an instrument, practice your favorite songs, and enjoy making music.",
    time: "30–60 min",
    level: "Practice needed",
  },
  {
    id: "chess",
    name: "Chess",
    category: "Learning",
    emoji: "♟️",
    tone: "tone-blue",
    description:
      "Challenge your mind, plan your moves, and develop strategic thinking.",
    time: "30–60 min",
    level: "Beginner friendly",
  },
  {
    id: "language",
    name: "Learning Languages",
    category: "Learning",
    emoji: "🌍",
    tone: "tone-green",
    description:
      "Discover new cultures and connect with people through a new language.",
    time: "15–30 min",
    level: "Practice needed",
  },
];

const STORAGE_KEYS = {
  saved: "hobbyhub_saved_v1",
  custom: "hobbyhub_custom_v1",
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Could not read saved data:", error);
    return fallback;
  }
}

let customHobbies = readStorage(STORAGE_KEYS.custom, []);
let savedHobbyIds = readStorage(STORAGE_KEYS.saved, []);

if (!Array.isArray(customHobbies)) customHobbies = [];
if (!Array.isArray(savedHobbyIds)) savedHobbyIds = [];

let activeCategory = "All";
let searchQuery = "";
let sortMode = "default";
let toastTimer;

const hobbyGrid = document.getElementById("hobby-grid");
const savedGrid = document.getElementById("saved-grid");
const emptyState = document.getElementById("empty-state");
const savedEmpty = document.getElementById("saved-empty");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const hobbyForm = document.getElementById("hobby-form");
const formMessage = document.getElementById("form-message");
const toast = document.getElementById("toast");

function getAllHobbies() {
  return [...defaultHobbies, ...customHobbies];
}

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(savedHobbyIds));

    localStorage.setItem(STORAGE_KEYS.custom, JSON.stringify(customHobbies));
  } catch (error) {
    console.warn("Could not save data:", error);
    showToast("Unable to save. Check your browser storage.");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function createHobbyCard(hobby, isSavedSection = false) {
  const saved = savedHobbyIds.includes(hobby.id);
  const safeId = escapeHTML(hobby.id);

  const heartButton = `
        <button
            class="heart-button ${saved ? "saved" : ""}"
            data-action="toggle-save"
            data-id="${safeId}"
            aria-label="${saved ? "Remove from" : "Add to"} favorites: ${escapeHTML(hobby.name)}"
            aria-pressed="${saved}"
            title="${saved ? "Remove from favorites" : "Add to favorites"}"
        >${saved ? "♥" : "♡"}</button>
    `;

  const deleteButton =
    isSavedSection && customHobbies.some((item) => item.id === hobby.id)
      ? `<button class="delete-button" data-action="delete-custom" data-id="${safeId}">Delete hobby</button>`
      : "";

  return `
        <article class="hobby-card">
            <div class="card-top">
                <div class="hobby-emoji ${escapeHTML(hobby.tone || "tone-green")}">
                    ${escapeHTML(hobby.emoji || "✨")}
                </div>
                ${heartButton}
            </div>

            <span class="hobby-category">${escapeHTML(hobby.category)}</span>
            <h3>${escapeHTML(hobby.name)}</h3>
            <p class="hobby-description">${escapeHTML(hobby.description)}</p>

            <div class="card-footer">
                <span>◷ ${escapeHTML(hobby.time || "Flexible")}</span>
                <span class="level-label">${escapeHTML(hobby.level || "Your pace")}</span>
            </div>

            ${deleteButton}
        </article>
    `;
}

function renderDiscover() {
  let hobbies = getAllHobbies();

  if (activeCategory !== "All") {
    hobbies = hobbies.filter((hobby) => hobby.category === activeCategory);
  }

  if (searchQuery) {
    hobbies = hobbies.filter((hobby) => {
      const searchableText = [hobby.name, hobby.category, hobby.description]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchQuery);
    });
  }

  if (sortMode === "az") {
    hobbies.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortMode === "easy") {
    hobbies.sort((a, b) => {
      const aEasy = a.level === "Beginner friendly" ? 0 : 1;
      const bEasy = b.level === "Beginner friendly" ? 0 : 1;

      return aEasy - bEasy || a.name.localeCompare(b.name);
    });
  }

  hobbyGrid.innerHTML = hobbies.map((hobby) => createHobbyCard(hobby)).join("");

  emptyState.classList.toggle("hidden", hobbies.length > 0);
}

function renderSaved() {
  const savedHobbies = savedHobbyIds
    .map((id) => getAllHobbies().find((hobby) => hobby.id === id))
    .filter(Boolean);

  savedGrid.innerHTML = savedHobbies
    .map((hobby) => createHobbyCard(hobby, true))
    .join("");

  savedEmpty.classList.toggle("hidden", savedHobbies.length > 0);
  savedGrid.classList.toggle("hidden", savedHobbies.length === 0);

  document.getElementById("saved-count").textContent = savedHobbies.length;
  document.getElementById("nav-count").textContent = savedHobbies.length;
  document.getElementById("saved-heading-count").textContent =
    savedHobbies.length;
  document.getElementById("total-count").textContent = getAllHobbies().length;
}

function renderApp() {
  renderDiscover();
  renderSaved();
}

function toggleSaved(id) {
  const hobby = getAllHobbies().find((item) => item.id === id);

  if (!hobby) return;

  if (savedHobbyIds.includes(id)) {
    savedHobbyIds = savedHobbyIds.filter((savedId) => savedId !== id);
    showToast(`${hobby.name} removed from your collection.`);
  } else {
    savedHobbyIds.push(id);
    showToast(`${hobby.name} added to your collection!`);
  }

  saveData();
  renderApp();
}

function deleteCustomHobby(id) {
  const hobby = customHobbies.find((item) => item.id === id);

  if (!hobby) return;

  const confirmed = window.confirm(
    `Delete "${hobby.name}" from your custom hobbies?`,
  );

  if (!confirmed) return;

  customHobbies = customHobbies.filter((item) => item.id !== id);
  savedHobbyIds = savedHobbyIds.filter((savedId) => savedId !== id);

  saveData();
  renderApp();
  showToast(`${hobby.name} deleted.`);
}

document
  .getElementById("category-filters")
  .addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    activeCategory = button.dataset.category;

    document.querySelectorAll(".filter-chip").forEach((chip) => {
      const isActive = chip.dataset.category === activeCategory;

      chip.classList.toggle("active", isActive);
      chip.setAttribute("aria-pressed", String(isActive));
    });

    renderDiscover();
  });

searchInput.addEventListener("input", (event) => {
  searchQuery = event.target.value.trim().toLowerCase();
  renderDiscover();
});

sortSelect.addEventListener("change", (event) => {
  sortMode = event.target.value;
  renderDiscover();
});

document.getElementById("reset-filters").addEventListener("click", () => {
  activeCategory = "All";
  searchQuery = "";
  sortMode = "default";

  searchInput.value = "";
  sortSelect.value = "default";

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    const isActive = chip.dataset.category === "All";
    chip.classList.toggle("active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });

  renderDiscover();
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");

  if (!button) return;

  const { action, id } = button.dataset;

  if (action === "toggle-save") {
    toggleSaved(id);
  }

  if (action === "delete-custom") {
    deleteCustomHobby(id);
  }
});

hobbyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(hobbyForm);

  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "Creative");
  const description = String(formData.get("description") || "").trim();
  const time = String(formData.get("time") || "Flexible");

  if (!name || !description) {
    formMessage.textContent = "Please fill in all required fields.";
    return;
  }

  const duplicate = getAllHobbies().some(
    (hobby) => hobby.name.toLowerCase() === name.toLowerCase(),
  );

  if (duplicate) {
    formMessage.textContent = "That hobby already exists in your collection.";
    return;
  }

  const tones = {
    Creative: "tone-peach",
    Outdoor: "tone-green",
    Fitness: "tone-blue",
    Relaxation: "tone-purple",
    Learning: "tone-yellow",
  };

  const emojis = {
    Creative: "🎨",
    Outdoor: "🌿",
    Fitness: "💪",
    Relaxation: "☁️",
    Learning: "📚",
  };

  const hobby = {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    category,
    description,
    time,
    emoji: emojis[category] || "✨",
    tone: tones[category] || "tone-green",
    level: "Your own hobby",
    custom: true,
  };

  customHobbies.push(hobby);
  saveData();

  hobbyForm.reset();
  formMessage.textContent = `${name} has been added successfully!`;

  activeCategory = "All";
  searchQuery = "";
  searchInput.value = "";

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    const isActive = chip.dataset.category === "All";
    chip.classList.toggle("active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });

  renderApp();
  showToast(`${name} added to HobbyHub!`);

  document.getElementById("discover").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

// Initialize the app.
document.querySelectorAll(".filter-chip").forEach((chip) => {
  chip.setAttribute("aria-pressed", String(chip.dataset.category === "All"));
});

renderApp();
