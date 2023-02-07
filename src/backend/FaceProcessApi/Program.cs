// using FaceProcessApi.Consumers;

using FaceProcessApi.Consumers;
using MassTransit;
using SharedLib;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMassTransit(config =>
{
    config.AddConsumer<OrderRegisterdConsumer>();
    config.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host("localhost", "/", cfgHost =>
        {
            cfgHost.Username(RabbitMqConstants.RmqUsername);
            cfgHost.Password(RabbitMqConstants.RmqPassword);
        });
        
        cfg.ReceiveEndpoint(RabbitMqConstants.OrderProcessedEvent, configEndpoint =>
        {
            configEndpoint.ConfigureConsumer<OrderRegisterdConsumer>(ctx);
        } );
    });
});

builder.Services.AddSingleton<IFaceHandler, FaceHandler>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();