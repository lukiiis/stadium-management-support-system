using backend.Auth;
using backend.Data;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend.Extensions;
using System.Text.Json;
using System.IdentityModel.Tokens.Jwt;
using backend.Mappers;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("PostgresConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString)
           .EnableSensitiveDataLogging()
           .LogTo(Console.WriteLine, LogLevel.Information));

builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddSingleton<TokenProvider>();
builder.Services.AddSingleton<PasswordHasher>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.RequireHttpsMetadata = false;
        o.TokenValidationParameters = new TokenValidationParameters
        {
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)),
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ClockSkew = TimeSpan.Zero,
            ValidateLifetime = true
        };
    });

//for endpoint authentication etc
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("AdminOnly", policy => policy.RequireRole("ADMIN"))
    .AddPolicy("ClientOnly", policy => policy.RequireRole("CLIENT"))
    .AddPolicy("EmployeeOnly", policy => policy.RequireRole("EMPLOYEE"))
    .AddPolicy("AuthorizedOnly", policy => policy.RequireRole("EMPLOYEE", "ADMIN", "CLIENT"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost3000",
        builder => builder.WithOrigins("http://localhost:3000")
                          .AllowAnyMethod()
                          .AllowAnyHeader());

    options.AddPolicy("AllowLocalhost8081",
    builder => builder.WithOrigins("http://localhost:8081")
                      .AllowAnyMethod()
                      .AllowAnyHeader());

    options.AddPolicy("AllowExpo",
    builder => builder.WithOrigins("exp://192.168.0.248:8081")
                  .AllowAnyMethod()
                  .AllowAnyHeader());
    options.AddPolicy("AllowAll",
    builder => builder.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader());
});

builder.Services.AddScoped<LoginUser>();
builder.Services.AddScoped<RegisterUser>();
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<IReservationsService, ReservationsService>();
builder.Services.AddScoped<ITournamentsService, TournamentsService>();
builder.Services.AddScoped<IReservationTimesheetsService, ReservationTimesheetsService>();
builder.Services.AddScoped<IAddressService, AddressService>();
builder.Services.AddScoped<IObjectTypeService, ObjectTypesService>();

builder.Services.AddControllers()
    //nice way to avoid cycles in responses, but records are better i think
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGenWithAuth();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowLocalhost3000");
app.UseCors("AllowLocalhost8081");
app.UseCors("AllowExpo");
app.UseCors("AllowAll");

app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
            Path.Combine(builder.Environment.ContentRootPath, "Resources")),
    RequestPath = "/Resources"
});

//auth
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();