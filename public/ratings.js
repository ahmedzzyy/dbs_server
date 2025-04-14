const container = document.getElementById("ratings-container");
const modal = document.getElementById("movie-modal");
const closeBtn = document.querySelector(".close-button");

async function fetchMovies(sort = "", direction = "ASC") {
  let url = "/api/movies";
  if (sort) url += `&sortBy=${sort}&sortDirection=${direction}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    renderMovies(data.movies);
  } catch (err) {
    console.error("Error fetching movies:", err);
  }
}

function renderMovies(movies) {
  container.innerHTML = movies
    .map((movie) => {
      return `
        <div class="movie-card"
          data-id="${movie.movie_id}">
          <div class="movie-info">
            <h3>${movie.title}</h3>
            <p class="release-date">Release: ${movie.release_year}</p>
            <p class="overview">Directed by ${movie.director}</p>
            <button class="view-more-btn" data-id="${movie.movie_id}">
              View More
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

function openModal() {
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

container.addEventListener("click", async (e) => {
  const viewBtn = e.target.closest(".view-more-btn");
  if (!viewBtn) return;

  const movieId = viewBtn.dataset.id;
  window.currentMovieId = movieId;

  try {
    const res = await fetch(`/api/movies/${movieId}`);
    const movie = await res.json();

    document.getElementById("modal-title").textContent = movie.title;
    document.getElementById("modal-overview").textContent = `Genre: ${movie.genre}`;
    document.getElementById("modal-date").textContent = movie.release_year;
    document.getElementById("modal-rating").textContent = movie.reviews.length
      ? `${(
          movie.reviews.reduce((sum, r) => sum + r.rating, 0) /
          movie.reviews.length
        ).toFixed(1)}/10`
      : "No rating";

    document.getElementById("modal-cast").textContent = movie.cast
      .map((c) => c.actor_name)
      .join(", ") || "No cast listed";

    // Optional: Add reviews and awards if those sections exist in your modal
    const reviewsList = document.getElementById("modal-reviews");
    reviewsList.innerHTML = movie.reviews.length
      ? movie.reviews.map(r => `<li><strong>${r.username}</strong>: ${r.comment} (${r.rating}/10)</li>`).join("")
      : "<li>No reviews available.</li>";

    const awardsList = document.getElementById("modal-awards");
    awardsList.innerHTML = movie.awards.length
      ? movie.awards.map(a => `<li>${a.year}: ${a.award_name} - ${a.award_category}</li>`).join("")
      : "<li>No awards listed.</li>";

    openModal();
  } catch (err) {
    console.error("Error fetching movie detail:", err);
  }
});

// Show/hide review form if token exists
const reviewFormContainer = document.getElementById("review-form-container");
if (localStorage.getItem("token")) {
  reviewFormContainer.classList.remove("hidden");
  document.getElementById("review-form").onsubmit = async (event) => {
    event.preventDefault();
    const comment = document.getElementById("review-comment").value;
    const rating = parseInt(document.getElementById("review-rating").value);

    if (!rating || rating < 1 || rating > 10) {
      alert("Rating must be between 1 and 10.");
      return;
    }

    try {
      const res = await fetch(`/api/movies/${window.currentMovieId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ comment, rating }),
      });

      if (!res.ok) throw new Error("Failed to post review");
      alert("Review submitted successfully!");

      // Optional: Refresh modal content
      const updated = await fetch(`/api/movies/${window.currentMovieId}`);
      const updatedMovie = await updated.json();

      const reviewsList = document.getElementById("modal-reviews");
      reviewsList.innerHTML = updatedMovie.reviews.length
        ? updatedMovie.reviews.map(r =>
            `<li><strong>${r.username}</strong>: ${r.comment} (${r.rating}/10)</li>`
          ).join("")
        : "<li>No reviews available.</li>";

      // Reset form
      event.target.reset();
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Something went wrong. Please try again.");
    }
  };
} else {
  reviewFormContainer.classList.add("hidden");
}


fetchMovies();
