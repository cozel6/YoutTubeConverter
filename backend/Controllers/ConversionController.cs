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

            if (response.Success)
            {
                var downloadUrl = $"{Request.Scheme}://{Request.Host}/downloads/{response.FileName}";
                response.DownloadUrl = downloadUrl;
                Console.WriteLine($"Generated download URL: {downloadUrl}");
                return Ok(response);

            }
            Console.WriteLine(response);

            return response.Success ? Ok(response) : BadRequest(response);
        }
        [HttpGet("{fileName}")]
        public IActionResult DownloadFile(string fileName)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "downloads", fileName);


            if (!System.IO.File.Exists(filePath))
                return NotFound("Fisierul nu exista");
            var fileType = "application/octet-stream";

            return PhysicalFile(filePath, fileType , fileName);
        }
    }
}
