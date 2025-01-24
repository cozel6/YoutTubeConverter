using YouTubeConverter.Models;

namespace YouTubeConverter.Services
{
    public class QualitySelector : IQualitySelector
    {
        public string GetFormatParameter(CustomVideoQuality quality)
        {
            return quality switch
            {
                CustomVideoQuality.Low => "bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]",
                CustomVideoQuality.Medium => "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]",
                CustomVideoQuality.High => "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]",
                _ => "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]"
            };
        }
    }
}