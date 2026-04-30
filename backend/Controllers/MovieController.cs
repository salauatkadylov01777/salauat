using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
namespace backend.Controllers
{
    [ApiController]
    [Route("api/movies")]
    public class MoviesController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly AppDbContext _db;

        // 🔑 Вставь сюда свой TMDB API Key
        private readonly string _apiKey = "0b2c33111db2e69d5c08485f6aaa3f18";

        public MoviesController(HttpClient httpClient, AppDbContext db)
        {
            _httpClient = httpClient;
            _db = db;
        }

        // 🔥 Популярные фильмы
        [HttpGet("popular")]
        public async Task<IActionResult> Popular()
        {
            var url = $"https://api.themoviedb.org/3/movie/popular?api_key={_apiKey}&language=ru-RU&page=1";

            var response = await _httpClient.GetStringAsync(url);

            // TMDB возвращает JSON string
            return Ok(response);
        }

        // 🔍 Поиск фильмов
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Query is empty");

            var safeQuery = Uri.EscapeDataString(query);

            var url = $"https://api.themoviedb.org/3/search/movie?api_key={_apiKey}&query={safeQuery}&language=ru-RU&page=1";

            var response = await _httpClient.GetStringAsync(url);

            return Ok(response);
        }

        // ❤️ Получить сохраненные фильмы из SQLite
        [HttpGet("saved")]
        public IActionResult GetSaved()
        {
            var movies = _db.Movies.ToList();
            return Ok(movies);
        }

        // 💾 Сохранить фильм в SQLite
        [HttpPost("save")]
        public IActionResult SaveMovie([FromBody] Movie movie)
        {
            if (movie == null)
                return BadRequest("Movie is null");

            _db.Movies.Add(movie);
            _db.SaveChanges();

            return Ok(movie);
        }

        // ❌ Удалить фильм по ID
        [HttpDelete("delete/{id}")]
        public IActionResult DeleteMovie(int id)
        {
            var movie = _db.Movies.FirstOrDefault(m => m.Id == id);

            if (movie == null)
                return NotFound("Movie not found");

            _db.Movies.Remove(movie);
            _db.SaveChanges();

            return Ok("Deleted");
        }
    }
}