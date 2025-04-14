const container = document.getElementById("actors-container");
const searchInput = document.getElementById("searchBar");

let allActors = [];

async function fetchActors() {
  try {
    const res = await fetch("/api/actors");
    allActors = await res.json();
    displayActors(allActors);
  } catch (error) {
    console.error(error);
  }
}

function displayActors(actors) {
  container.innerHTML = "";

  actors.forEach((actor) => {
    const card = `
      <tr>
        <td>${actor.actor_name}</td>
        <td>${actor.country}</td>
      </tr>
    `;
    container.innerHTML += card;
  });
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = allActors.filter((actor) =>
    actor.actor_name.toLowerCase().includes(query),
  );
  displayActors(filtered);
});

fetchActors();
