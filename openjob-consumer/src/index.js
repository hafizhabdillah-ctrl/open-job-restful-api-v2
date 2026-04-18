import 'dotenv/config';
import amqp from 'amqplib';
import Listener from './Listener.js';
import MailSender from './MailSender.js';

const init = async () => {
  const mailSender = new MailSender();
  const listener = new Listener(mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_HOST || 'amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue('apply:job', { durable: true });

  channel.consume('apply:job', listener.listen, { noAck: true });

  console.log('Consumer running and listening to apply:job queue');
};

init();