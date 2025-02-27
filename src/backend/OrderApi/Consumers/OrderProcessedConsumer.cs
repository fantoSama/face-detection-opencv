﻿using MassTransit;
using OrderApi.Models;
using OrderApi.Repository;
using SharedLib.Contracts;

namespace OrderApi.Consumers;

public class OrderProcessedConsumer : IConsumer<IOrderProcessedEvent>
{
    private readonly IFaceRepository _faceRepository;
    private readonly ILogger<OrderProcessedConsumer> _logger;
    private readonly IOrderRepository _orderRepository;
    private readonly IPublishEndpoint _publishEndpoint;

    public OrderProcessedConsumer(IOrderRepository orderRepository, ILogger<OrderProcessedConsumer> logger,
        IFaceRepository faceRepository, IPublishEndpoint publishEndpoint)
    {
        _orderRepository = orderRepository;
        _logger = logger;
        _faceRepository = faceRepository;
        _publishEndpoint = publishEndpoint;
    }

    public async Task Consume(ConsumeContext<IOrderProcessedEvent> context)
    {
        var msg = context.Message;
        var counter = 0;
        foreach (var image in msg.FaceData)
        {
            var face = new Face { Id = Guid.NewGuid(), OrderId = msg.OrderId, FaceData = image };
            await _faceRepository.Create(face);
            _logger.LogInformation("Face number {count} has been added to the db", counter++);
        }

        var order = await _orderRepository.GetById(msg.OrderId);
        order.Status = OrderStatus.Processed;
        await _orderRepository.Save();

        await _publishEndpoint.Publish<IOrderSendEvent>(new
        {
            order.OrderId,
            order.Username,
            order.Email,
            order.ImageName,
            Faces = msg.FaceData
        });
        _logger.LogInformation("All faces have been added to the database");
        _logger.LogInformation("The OrderSendEvent has been dispatched !");
        _logger.LogInformation("the faceApi could extract {FaceDataCount} out from the image ", msg.FaceData.Count);
    }
}