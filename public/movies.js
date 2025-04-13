const API_KEY = 'a51bc4a5c1986eed1a130d903e71d249';

const searchInput = document.getElementById("searchBar"); // 🔁 fixed
const container = document.getElementById("movieResults"); // 🔁 fixed

searchInput.addEventListener("input", async () => {
  const query = searchInput.value;
  if (query.length < 2) return;

  const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
  const data = await res.json();
  container.innerHTML = "";

  data.results.forEach(movie => {
    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : "placeholder.jpg";
    container.innerHTML += `
      <div class="movie-card">
        <img src="${poster}" />
        <h4>${movie.title}</h4>
      </div>
    `;
  });
});
function displayMovies(movies) {
    const container = document.getElementById("movieResults");
    container.innerHTML = "";
    movies.forEach(movie => {
      const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
        : "placeholder.jpg";
      container.innerHTML += `
        <div class="movie-card">
          <img src="${poster}" />
          <h4>${movie.title}</h4>
        </div>
      `;
    });
  }


window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
  const data = await res.json();
  displayMovies(data.results);
});

searchInput.addEventListener("input", async () => {
    const query = searchInput.value;
    if (query.length < 2) return;
  
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
    const data = await res.json();
    displayMovies(data.results);
  });