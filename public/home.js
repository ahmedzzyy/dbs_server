// 🔥 Explore button
document.getElementById("exploreBtn")?.addEventListener("click", function () {
    alert("Redirecting to the explore section...");
  });
  
  // 🎞️ Auto-scroll for sliders (optional enhancement)
  function autoScrollSlider(containerSelector) {
    const slider = document.querySelector(containerSelector);
    let scrollAmount = 0;
  
    setInterval(() => {
      if (!slider) return;
      scrollAmount += 200;
      if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
        scrollAmount = 0;
      }
      slider.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }, 3000);
  }
  
  autoScrollSlider(".slider-container"); // Optional: call for each slider if needed
  
  // 🌐 TMDb API Config
  const API_KEY = 'a51bc4a5c1986eed1a130d903e71d249';
  const BASE_URL = 'https://api.themoviedb.org/3';
  const IMAGE_URL = 'https://image.tmdb.org/t/p/w300';
  
  // 📥 Universal movie fetcher
  async function fetchMovies(url, containerId) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      displayMovies(data.results, containerId);
    } catch (err) {
      console.error(`Error fetching movies for ${containerId}:`, err);
    }
  }
  
  // 🖼️ Movie display logic
  function displayMovies(movies, containerId) {
    const slider = document.getElementById(containerId);
    slider.innerHTML = '';
  
    movies.forEach(movie => {
      if (!movie.poster_path) return;
  
      const card = document.createElement('div');
      card.classList.add('movie-card');
  
      const img = document.createElement('img');
      img.src = `${IMAGE_URL}${movie.poster_path}`;
      img.alt = movie.title;
  
      card.appendChild(img);
      slider.appendChild(card);
    });
  }

  
  
  // 🚀 Load movies on window load
  window.onload = () => {
    fetchMovies(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`, 'movie-slider');
    fetchMovies(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`, 'top-rated-slider');
    fetchMovies(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`, 'now-playing-slider');
  };
  autoScrollSlider("#movie-slider");
autoScrollSlider("#top-rated-slider");
autoScrollSlider("#now-playing-slider");
// Load movies on page load
window.onload = fetchTrendingMovies;