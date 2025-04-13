const forms = document.querySelectorAll(".form-box");
const links = document.querySelectorAll(".toggle-text a");

links.forEach((link) => {
  link.addEventListener("click", () => {
    forms.forEach((f) => f.classList.toggle("hidden"));
  });
});

// Handle signup form submission
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const result = await response.json();

  if (response.ok) {
    alert(result.message);
  } else {
    alert(result.error || "An error occurred while signing up.");
  }
});

// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (response.ok) {
    alert(result.message);
    localStorage.setItem("token", result.token);

    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  } else {
    alert(result.error || "An error occurred while logging in.");
  }
});
