using YouTubeConverter.Models;

namespace YouTubeConverter.Services
{
    public class QualitySelector : IQualitySelector
    {
        public string GetFormatParameter(CustomVideoQuality quality)
        {

            return quality switch
            {
                CustomVideoQuality.Low => "bv*[height<=480]+ba/b",
                CustomVideoQuality.Medium => "bv*[height<=720]+ba/b",
                CustomVideoQuality.High => "bv*[height<=1080]+ba/b",
                _ => "bv*+ba/b" //
            };
        }
    }
}