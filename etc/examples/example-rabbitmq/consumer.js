import "dotenv/config";
import amqplib from "amqplib";

const QUEUE_NAME = "cola-de-tareas"; // inbox service

// connect to RabbitMQ broker
const connection = await amqplib.connect(process.env.RABBITMQ_BROKER_URL);

// create a channel
const channel = await connection.createChannel();

// ensure that my message queue exists
await channel.assertQueue(QUEUE_NAME, {
  durable: true, //  if true, the queue will survive broker restarts
});

channel.prefetch(10); // the channel accepts messages 10 at a time

// subscribe to the queue
channel.consume(QUEUE_NAME, async (message) => {
  const payload = JSON.parse(message.content.toString());

  // we pretend to process the message
  console.log(payload, typeof payload);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  channel.ack(message);
});
