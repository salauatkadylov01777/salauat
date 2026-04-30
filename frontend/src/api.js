const API = "http://localhost:5181/api/movies";

export async function getPopular() {
  const res = await fetch(`${API}/popular`);
  return await res.json();
}

export async function searchMovies(q) {
  const res = await fetch(`${API}/search?q=${q}`);
  return await res.json();
}

export async function saveMovie(movie) {
  await fetch(`${API}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  });
}

export async function getSaved() {
  const res = await fetch(`${API}/saved`);
  return await res.json();
}