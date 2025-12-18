import amqp, { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';

const RABBIT_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const EXCHANGE_NAME = 'socialhub_events';

class RabbitMQManager {
  private connection: AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;

  constructor() {
    this.connection = amqp.connect([RABBIT_URL]);
    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel: Channel) => {
        return channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
      },
    });

    this.connection.on('connect', () => console.log('Connected to RabbitMQ'));
    this.connection.on('disconnect', (err) => console.error('Disconnected from RabbitMQ', err));
  }

  async publish(routingKey: string, payload: any) {
    try {
      await this.channelWrapper.publish(EXCHANGE_NAME, routingKey, payload, {
        persistent: true,
      } as any);
      console.log(`[RabbitMQ] Event published: ${routingKey}`);
    } catch (error) {
      console.error(`[RabbitMQ] Error publishing event: ${routingKey}`, error);
      throw error;
    }
  }
}

export const rabbitMQ = new RabbitMQManager();
