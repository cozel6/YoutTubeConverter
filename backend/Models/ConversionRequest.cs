using System.ComponentModel.DataAnnotations;

namespace YouTubeConverter.Models
{
    public class ConversionRequest
    {
        [Required]
        public string YouTubeUrl { get; set; }

        [Required]
        public CustomVideoQuality Quality { get; set; }
    }
}
