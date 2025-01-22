
using Microsoft.OpenApi.Models;
using YouTubeConverter.Services;

namespace YouTubeConverter
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            //cors
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.WithOrigins("http://localhost:58653")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            builder.Services.AddScoped<IQualitySelector, QualitySelector>();
            builder.Services.AddScoped<IConversionService, YtdlpConversionService>();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    var path = ctx.File.PhysicalPath;
                    if (path.Contains("wwwroot\\downloads"))
                    {
                        ctx.Context.Response.Headers["Content-Disposition"] =
                            "attachment; filename=\"" + Path.GetFileName(path) + "\"";
                    }
                }
            });


            app.UseHttpsRedirection();
            app.UseCors("AllowAll");
            app.MapControllers();


            app.Run();
        }
    }
}
