namespace YouTubeConverter.Models
{
    public class ConversionResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string DownloadUrl { get; set; } = string.Empty;
    }
}
