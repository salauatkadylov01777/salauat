// frontend movie interface
// import React, { useEffect, useState } from "react";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [savedMovies, setSavedMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5181/api/movies";

  // 🔥 Загрузка популярных фильмов
  async function loadPopular() {
    try {
      setLoading(true);

      const res = await fetch(`${API}/popular`);
      const data = await res.json();

      setMovies(data.results || []);
    } catch (err) {
      console.error("Popular error:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  // 🔍 Поиск фильмов
  async function searchMovies() {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(`${API}/search?query=${query}`);
      const data = await res.json();

      setMovies(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  // ❤️ Загрузка сохраненных фильмов
  async function loadSaved() {
    try {
      setLoading(true);

      const res = await fetch(`${API}/saved`);
      const data = await res.json();

      setSavedMovies(data);
    } catch (err) {
      console.error("Saved error:", err);
      setSavedMovies([]);
    } finally {
      setLoading(false);
    }
  }

  // 💾 Сохранить фильм в SQLite
  async function saveMovie(movie) {
    try {
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

      alert("Фильм сохранён!");
      loadSaved();
    } catch (err) {
      console.error("Save error:", err);
    }
  }

  // Авто загрузка при старте
  useEffect(() => {
    loadPopular();
    loadSaved();
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h1 style={{ marginBottom: 10 }}>🎬 Movie App (TMDB)</h1>

      {/* Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите название фильма..."
          style={{
            padding: 10,
            width: 300,
            borderRadius: 8,
            border: "1px solid gray"
          }}
        />

        <button style={btnStyle} onClick={searchMovies}>
          Search
        </button>

        <button style={btnStyle} onClick={loadPopular}>
          Popular
        </button>

        <button style={btnStyle} onClick={loadSaved}>
          Saved
        </button>
      </div>

      {/* Loading */}
      {loading && <p>⏳ Loading...</p>}

      {/* Movies list */}
      <h2>Результаты:</h2>
      <div style={gridStyle}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} style={cardStyle}>
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: "100%", borderRadius: 10 }}
                />
              ) : (
                <div
                  style={{
                    height: 250,
                    background: "#ddd",
                    borderRadius: 10
                  }}
                />
              )}

              <h3>{movie.title}</h3>
              <p style={{ fontSize: 14 }}>
                {movie.overview
                  ? movie.overview.slice(0, 100) + "..."
                  : "Нет описания"}
              </p>

              <button style={btnStyle} onClick={() => saveMovie(movie)}>
                Save
              </button>
            </div>
          ))
        ) : (
          !loading && <p>Нет фильмов</p>
        )}
      </div>

      {/* Saved movies */}
      <h2 style={{ marginTop: 40 }}>❤️ Saved Movies:</h2>
      <ul>
        {savedMovies.length > 0 ? (
          savedMovies.map((m) => <li key={m.id}>{m.title}</li>)
        ) : (
          <p>Пока ничего не сохранено</p>
        )}
      </ul>
    </div>
  );
}

// 🎨 styles
const btnStyle = {
  padding: "10px 15px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  background: "black",
  color: "white"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: 15
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: 15,
  padding: 10,
  boxShadow: "0px 2px 6px rgba(0,0,0,0.15)"
};