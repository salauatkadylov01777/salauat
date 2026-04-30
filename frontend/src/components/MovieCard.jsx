import { saveMovie } from "../api";

export default function MovieCard({ movie }) {
  return (
    <div style={{ width: 200, margin: 10 }}>
      <img
        width="100%"
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
      />
      <h4>{movie.title}</h4>

      <button onClick={() => saveMovie({
        tmdbId: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path
      })}>
        ❤️ Save
      </button>
    </div>
  );
}