import "dotenv/config";
import amqplib from "amqplib";

const EXCHANGE_NAME = "peticiones-de-tareas";

// connect to the RabbitMQ broker
const connection = await amqplib.connect(process.env.RABBITMQ_BROKER_URL);

// create a channel
const channel = await connection.createChannel();

// create an exhange
await channel.assertExchange(EXCHANGE_NAME, "direct", {
  durable: true, //  if true, the exchange will survive broker restarts. Defaults to true.
});

let keepSending = true;

while (true) {
  // Send a message
  const message = {
    tarea: "Send an E-Mail" + Date.now(),
  };

  //channel.publish(EXCHANGE_NAME, "*", Buffer.from(JSON.stringify(message)));
  // check if I can send more messages or I have to give it some time the channel accepts messages 10 at a time
  if (!keepSending) {
    console.warn("*** SATURATED CHANNEL, WE WAIT FOR THE INPUT BUFFER TO BE DRAINED ***");
    // wait for RabbitMQ to tell me that I can continue giving him messages
    await new Promise((resolve) => {
      channel.on("drain", resolve);
    });
  }

  keepSending = channel.publish(EXCHANGE_NAME, "*", Buffer.from(JSON.stringify(message)));
  console.log("Sending Message", message);
  await new Promise((resolve) => setTimeout(resolve, 100));
  //await new Promise((resolve) => setTimeout(resolve, 1));
}
