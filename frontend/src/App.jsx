import React, { useEffect, useState } from "react";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [savedMovies, setSavedMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5181/api/movies";

  // 🔥 Popular
  async function loadPopular() {
    setLoading(true);
    const res = await fetch(`${API}/popular`);
    const text = await res.text();
    const data = JSON.parse(text);
    setMovies(data.results || []);
    setLoading(false);
  }

  // 🔍 Search
  async function searchMovies() {
    if (!query.trim()) return;

    setLoading(true);
    const res = await fetch(`${API}/search?query=${query}`);
    const text = await res.text();
    const data = JSON.parse(text);
    setMovies(data.results || []);
    setLoading(false);
  }

  // ❤️ Saved
  async function loadSaved() {
    const res = await fetch(`${API}/saved`);
    const data = await res.json();
    setSavedMovies(data);
  }

  // 💾 Save
  async function saveMovie(movie) {
    await fetch(`${API}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tmdbId: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path
      })
    });

    alert("Сохранено!");
    loadSaved();
  }

  // ⭐ СОРТИРОВКА
  function sortByRating() {
    const sorted = [...movies].sort(
      (a, b) => (b.vote_average || 0) - (a.vote_average || 0)
    );
    setMovies(sorted);
  }

  useEffect(() => {
    loadPopular();
    loadSaved();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial", background: "#111", color: "white", minHeight: "100vh" }}>
      <h1>🎬 Movie App</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          style={{ padding: 10, width: 200 }}
        />

        <button style={btnStyle} onClick={searchMovies}>Search</button>
        <button style={btnStyle} onClick={loadPopular}>Popular</button>
        <button style={btnStyle} onClick={loadSaved}>Saved</button>

        {/* 🔥 НОВАЯ КНОПКА */}
        <button style={btnStyle} onClick={sortByRating}>
          ⭐ Sort
        </button>
      </div>

      {loading && <p>⏳ Loading...</p>}

      <div style={gridStyle}>
        {movies.length > 0 ? (
          movies.map((m) => (
            <div
              key={m.id}
              style={cardStyle}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                style={{ width: "100%", borderRadius: 10 }}
              />

              <h3>{m.title}</h3>
              <p>⭐ {m.vote_average}</p>

              <button style={btnStyle} onClick={() => saveMovie(m)}>
                Save
              </button>
            </div>
          ))
        ) : (
          !loading && <p>Нет фильмов</p>
        )}
      </div>

      <h2 style={{ marginTop: 30 }}>❤️ Saved:</h2>
      <ul>
        {savedMovies.map((m) => (
          <li key={m.id}>{m.title}</li>
        ))}
      </ul>
    </div>
  );
}

// 🎨 styles
const btnStyle = {
  marginLeft: 10,
  padding: "10px 15px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  background: "#ff3d00",
  color: "white"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: 15
};

const cardStyle = {
  padding: 10,
  borderRadius: 10,
  background: "#222",
  transition: "0.3s"
};