using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using CartValidationApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Cart Validation API",
        Version = "v1"
    });
});
builder.Services.AddControllers();

var app = builder.Build();
app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cart Validation API v1");
    });
}

app.UseHttpsRedirection();

app.MapGet("/api/cart/validate", ([FromBody] CartRequest request) =>
{
    var skuLimits = new Dictionary<string, int>
    {
        { "WGT-A", 5 },
        { "WGT-B", 2 }
    };

    foreach (var item in request.Items)
    {
        if (skuLimits.TryGetValue(item.Sku, out var maxQty) && item.Quantity > maxQty)
        {
            return Results.Ok(new ValidateCartResponse
            {
                IsValid = false,
                Message = $"Exceeded limit for SKU: {item.Sku}"
            });
        }
    }

    return Results.Ok(new ValidateCartResponse { IsValid = true, Message = "Cart is valid."});
});

app.Run();

record CartItem(string Sku, int Quantity);
record CartRequest(string CustomerId, string CartId, List<CartItem> Items);
record CartResponse(bool IsValid, string Message);
