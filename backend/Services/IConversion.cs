using YouTubeConverter.Models;

namespace YouTubeConverter.Services
{
    public interface IConversionService
    {
        Task<ConversionResponse> ConvertAsync(ConversionRequest request);
    }
}
