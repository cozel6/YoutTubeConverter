using YouTubeConverter.Models;

namespace YouTubeConverter.Services
{
    public interface IQualitySelector
    {
        /// <summary>
        /// Întoarce string-ul corespunzător parametrului -f pentru yt-dlp.
        /// </summary>
        string GetFormatParameter(CustomVideoQuality quality);
    }
}
