import amqp from 'amqplib';

class ProducerService {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    if (!this.connection) {
      this.connection = await amqp.connect(process.env.RABBITMQ_HOST || 'amqp://localhost');
      this.channel = await this.connection.createChannel();
    }
  }

  async sendMessage(queue, message) {
    await this.connect();
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}

export default ProducerService;
