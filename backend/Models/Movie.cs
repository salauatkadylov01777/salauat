namespace backend.Models;

public class Movie
{
    public int Id { get; set; }
    public int TmdbId { get; set; }
    public string Title { get; set; }
    public string Overview { get; set; }
    public string PosterPath { get; set; }
}