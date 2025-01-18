using Microsoft.AspNetCore.Mvc;
using YouTubeConverter.Models;
using YouTubeConverter.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace YouTubeConverter.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConversionController : ControllerBase
    {
      private readonly IConversionService? _conversionService;

        public ConversionController(IConversionService conversionService)
        {
            _conversionService = conversionService;
        }
        [HttpPost]
        public async Task<IActionResult> ConvertAsync([FromBody] ConversionRequest request)
        {
            var response = await _conversionService.ConvertAsync(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}
