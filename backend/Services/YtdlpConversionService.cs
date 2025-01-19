using System.Diagnostics;
using YouTubeConverter.Models;

namespace YouTubeConverter.Services
{
    public class YtdlpConversionService : IConversionService
    {
        private readonly IQualitySelector _qualitySelector;

        // Calea completă către yt-dlp.exe (sau doar "yt-dlp" dacă e în PATH).
        private readonly string _ytDlpPath = @"M:\Projects\YoutTubeConverter\backend\yt-dlp.exe";

        private readonly string _ffmpegPath = @"M:\Projects\YoutTubeConverter\backend\ffmpeg\ffmpeg-N-118321-g4c96d6bf75-win64-gpl-shared\binffmpeg.exe";

        public YtdlpConversionService(IQualitySelector qualitySelector)
        {
            _qualitySelector = qualitySelector;
        }

        public async Task<ConversionResponse> ConvertAsync(ConversionRequest request)
        {
            if (string.IsNullOrEmpty(request.YouTubeUrl))
            {
                return new ConversionResponse
                {
                    Success = false,
                    Message = "URL-ul este invalid."
                };
            }

            try
            {
                var formatParam = _qualitySelector.GetFormatParameter(request.Quality);

                var tempFolder = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
                Directory.CreateDirectory(tempFolder);


                var outputPattern = Path.Combine(tempFolder, "%(title)s.%(ext)s");
                var ytdlpArgs =
                    $"-f \"{formatParam}\" " +
                    $"--restrict-filenames --no-warnings " +
                    $"-o \"{outputPattern}\" " +
                    $"\"{request.YouTubeUrl}\"";

                var startInfo = new ProcessStartInfo
                {
                    FileName = _ytDlpPath,
                    Arguments = ytdlpArgs,
                    RedirectStandardError = true,
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(startInfo);
                if (process == null)
                {
                    return new ConversionResponse
                    {
                        Success = false,
                        Message = "Nu s-a putut porni procesul yt-dlp."
                    };
                }

                var stdOutTask = process.StandardOutput.ReadToEndAsync();
                var stdErrTask = process.StandardError.ReadToEndAsync();

                await process.WaitForExitAsync();
                var stdOut = await stdOutTask;
                var stdErr = await stdErrTask;

                if (process.ExitCode != 0)
                {
                    return new ConversionResponse
                    {
                        Success = false,
                        Message = $"Eroare yt-dlp: {stdErr}"
                    };
                }

                var downloadedFile = new DirectoryInfo(tempFolder)
                    .GetFiles()
                    .OrderByDescending(f => f.LastWriteTime)
                    .FirstOrDefault();

                if (downloadedFile == null)
                {
                    return new ConversionResponse
                    {
                        Success = false,
                        Message = "Nu s-a descărcat niciun fișier."
                    };
                }

                var finalExtension = ".mp4";
                var finalFileName = Path.GetFileNameWithoutExtension(downloadedFile.Name)
                                    + "_converted"
                                    + finalExtension;
                var finalFilePath = Path.Combine(tempFolder, finalFileName);

                if (!downloadedFile.Extension.Equals(".mp4", StringComparison.OrdinalIgnoreCase))
                {
                    var ffmpegArgs = $"-i \"{downloadedFile.FullName}\" -c copy \"{finalFilePath}\"";
                    var ffmpegStart = new ProcessStartInfo
                    {
                        FileName = _ffmpegPath,
                        Arguments = ffmpegArgs,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };

                    using var ffmpegProcess = Process.Start(ffmpegStart);
                    if (ffmpegProcess == null)
                    {
                        return new ConversionResponse
                        {
                            Success = false,
                            Message = "Nu s-a putut porni ffmpeg."
                        };
                    }

                    await ffmpegProcess.WaitForExitAsync();
                    if (ffmpegProcess.ExitCode != 0)
                    {
                        var ffErr = await ffmpegProcess.StandardError.ReadToEndAsync();
                        return new ConversionResponse
                        {
                            Success = false,
                            Message = $"Eroare ffmpeg: {ffErr}"
                        };
                    }
                }
                else
                {
                    File.Move(downloadedFile.FullName, finalFilePath);
                }

                var downloadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "downloads");
                if (!Directory.Exists(downloadsFolder))
                    Directory.CreateDirectory(downloadsFolder);

                var destinationFileName = Path.GetFileName(finalFilePath);
                var destinationFilePath = Path.Combine(downloadsFolder, destinationFileName);
                if (File.Exists(destinationFilePath))
                    File.Delete(destinationFilePath);

                File.Move(finalFilePath, destinationFilePath);

                Directory.Delete(tempFolder, true);

                var downloadUrl = $"http://localhost:5213/downloads/{destinationFileName}";
                return new ConversionResponse
                {
                    Success = true,
                    Message = "Conversie reușită cu yt-dlp!",
                    DownloadUrl = downloadUrl
                };
            }
            catch (Exception ex)
            {
                return new ConversionResponse
                {
                    Success = false,
                    Message = "Eroare: " + ex.Message
                };
            }
        }
    }
}