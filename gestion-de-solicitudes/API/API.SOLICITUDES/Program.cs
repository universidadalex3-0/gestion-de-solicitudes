using API.DAPPER;
using API.LOGICA.NEGOCIO;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddScoped<SolicitudesDAL>();
builder.Services.AddScoped<SolicitudesBLL>();
builder.Services.AddOpenApi();
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy =>
    policy.WithOrigins(builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? ["http://localhost:5173"])
        .AllowAnyHeader().AllowAnyMethod()));
var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "Solicitudes v1"));
}
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors("Frontend");
app.MapControllers();
app.MapGet("/api/estado", () => Results.Ok(new { aplicacion = "Registro de solicitudes", estado = "API disponible" }));
app.Run();
