const API_KEY = "a51bc4a5c1986eed1a130d903e71d249";
const container = document.getElementById("ratings-container");

// Fetch and display popular movies
async function fetchPopularMovies() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
    const data = await res.json();

    data.results.forEach(movie => {
      const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : "placeholder.jpg";

      const ratingPercent = Math.round(movie.vote_average * 10);

      const card = `
        <div class="movie-card" 
             data-id="${movie.id}" 
             data-title="${movie.title}"
             data-overview="${movie.overview}" 
             data-date="${movie.release_date}"
             data-rating="${movie.vote_average}" 
             data-poster="${poster}">
          <img src="${poster}" alt="${movie.title}" />
          <div class="movie-info">
            <h3>${movie.title}</h3>
            <p class="release-date">Release: ${movie.release_date}</p>
            <p class="overview">${movie.overview.slice(0, 120)}...</p>
            <div class="rating-bar">
              <div class="rating-fill" style="width: ${ratingPercent}%"></div>
            </div>
            <p class="rating-text">Rating: ${movie.vote_average}/10</p>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });
  } catch (err) {
    console.error("Error fetching movies:", err);
  }
}

// Fetch cast of a movie
async function getCast(movieId) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`);
    const data = await res.json();
    return data.cast.slice(0, 5).map(actor => actor.name).join(", ");
  } catch (error) {
    return "Cast info not available";
  }
}

// Modal handling
const modal = document.getElementById("movie-modal");
const closeBtn = document.querySelector(".close-button");

function openModal() {
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

// Click handler for movie cards
container.addEventListener("click", async e => {
  const card = e.target.closest(".movie-card");
  if (!card) return;

  const movieId = card.dataset.id;

  document.getElementById("modal-title").textContent = card.dataset.title;
  document.getElementById("modal-overview").textContent = card.dataset.overview;
  document.getElementById("modal-date").textContent = card.dataset.date;
  document.getElementById("modal-rating").textContent = `${card.dataset.rating}/10`;
  document.getElementById("modal-poster").src = card.dataset.poster;

  const cast = await getCast(movieId);
  document.getElementById("modal-cast").textContent = cast;

  openModal();
});
const searchInput = document.getElementById("searchBar");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchSearchResults(query);
  } else {
    container.innerHTML = "";  // clear results
    fetchPopularMovies();      // reload popular movies
  }
});

async function fetchSearchResults(query) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();

    container.innerHTML = "";

    data.results.forEach(movie => {
      const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : "placeholder.jpg";

      const ratingPercent = Math.round(movie.vote_average * 10);

      const card = `
        <div class="movie-card" 
             data-id="${movie.id}" 
             data-title="${movie.title}"
             data-overview="${movie.overview}" 
             data-date="${movie.release_date}"
             data-rating="${movie.vote_average}" 
             data-poster="${poster}">
          <img src="${poster}" alt="${movie.title}" />
          <div class="movie-info">
            <h3>${movie.title}</h3>
            <p class="release-date">Release: ${movie.release_date}</p>
            <p class="overview">${movie.overview.slice(0, 120)}...</p>
            <div class="rating-bar">
              <div class="rating-fill" style="width: ${ratingPercent}%"></div>
            </div>
            <p class="rating-text">Rating: ${movie.vote_average}/10</p>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });
  } catch (error) {
    console.error("Search error:", error);
  }
}
// Start fetching on page load
fetchPopularMovies();