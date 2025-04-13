const container = document.getElementById("movieResultsBody");
const languageFilter = document.getElementById("languageFilter");
const sortOrder = document.getElementById("sortOrder");

let allMovies = [];

function displayMovies(movies) {
  container.innerHTML = "";

  movies.forEach((movie) => {
    const title = movie.title || "N/A";
    const genre = movie.genre || "Unknown";
    const language = movie.language || "Unknown";

    container.innerHTML += `
      <tr>
        <td data-label="Title">${title}</td>
        <td data-label="Director">${movie.director}</td>
        <td data-label="Release Year">${movie.release_year}</td>
        <td data-label="Genre">${genre}</td>
        <td data-label="Language">${language.toUpperCase()}</td>
      </tr>
    `;
  });
}

function updateLanguageOptions(movies) {
  const languages = [...new Set(movies.map((m) => m.language).filter(Boolean))];
  languages.sort();

  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang.toUpperCase();
    languageFilter.appendChild(option);
  });
}

function applyFilters() {
  let filtered = [...allMovies];

  const selectedLang = languageFilter.value;
  const selectedSort = sortOrder.value;

  if (selectedLang !== "all") {
    filtered = filtered.filter((m) => m.language === selectedLang);
  }

  filtered.sort((a, b) => {
    const yearA = parseInt(a.release_year);
    const yearB = parseInt(b.release_year);

    return selectedSort === "asc" ? yearA - yearB : yearB - yearA;
  });

  displayMovies(filtered);
}

languageFilter.addEventListener("change", applyFilters);
sortOrder.addEventListener("change", applyFilters);

window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(`/api/movies?page=1&pageSize=50`);
  const data = await res.json();
  allMovies = data.movies || [];

  updateLanguageOptions(allMovies);
  applyFilters();
});
