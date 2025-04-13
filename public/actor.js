const API_KEY = "a51bc4a5c1986eed1a130d903e71d249";
const container = document.getElementById("actors-container");
const searchInput = document.getElementById("searchBar");

async function fetchActors(query = "") {
  const url = query
    ? `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${query}`
    : `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  container.innerHTML = "";
  data.results.forEach(actor => {
    const profile = actor.profile_path
      ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
      : "placeholder.jpg";
    
    const knownFor = actor.known_for.map(item => item.title || item.name).join(", ");

    const card = `
      <div class="actor-card">
        <img src="${profile}" alt="${actor.name}" />
        <h3>${actor.name}</h3>
        <p>Known for: ${knownFor}</p>
        <p>Popularity: ${actor.popularity.toFixed(1)}</p>
      </div>
    `;
    container.innerHTML += card;
  });
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim();
  fetchActors(value);
});

fetchActors();