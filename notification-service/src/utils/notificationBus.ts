import amqp, { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { Channel, ConsumeMessage } from 'amqplib';

const RABBIT_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const EXCHANGE_NAME = 'socialhub_events';
const QUEUE_NAME = 'notification_queue';
const DLX_NAME = 'socialhub_dlx';
const DLQ_NAME = 'notification_dlq';

class NotificationBus {
    private connection: AmqpConnectionManager;
    private channelWrapper: ChannelWrapper;

    constructor() {
        this.connection = amqp.connect([RABBIT_URL]);
        this.channelWrapper = this.connection.createChannel({
            json: true,
            setup: async (channel: Channel) => {
                // Assert DLX and DLQ
                await channel.assertExchange(DLX_NAME, 'direct', { durable: true });
                await channel.assertQueue(DLQ_NAME, { durable: true });
                await channel.bindQueue(DLQ_NAME, DLX_NAME, 'notifications_dead');

                // Assert Main Exchange and Queue
                await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
                await channel.assertQueue(QUEUE_NAME, {
                    durable: true,
                    arguments: {
                        'x-dead-letter-exchange': DLX_NAME,
                        'x-dead-letter-routing-key': 'notifications_dead'
                    }
                });

                // Bind queue to multiple event types
                await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'user.created');
                await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'post.created');

                // This setup is for publisher channels.
                // Consumer channel setup is handled in the listen method.
                return channel;
            }
        });
    }

    async listen(onMessage: (msg: any, routingKey: string) => Promise<void>) {
        await this.channelWrapper.addSetup(async (channel: Channel) => {
            // Ensure Exchange and Queue exist before consuming
            await channel.assertExchange(DLX_NAME, 'direct', { durable: true });
            await channel.assertQueue(DLQ_NAME, { durable: true });
            await channel.bindQueue(DLQ_NAME, DLX_NAME, 'notifications_dead');

            await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
            await channel.assertQueue(QUEUE_NAME, {
                durable: true,
                arguments: {
                    'x-dead-letter-exchange': DLX_NAME,
                    'x-dead-letter-routing-key': 'notifications_dead'
                }
            });

            await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'user.created');
            await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'post.created');

            await channel.consume(QUEUE_NAME, async (msg: ConsumeMessage | null) => {
                if (!msg) return;

                const routingKey = msg.fields.routingKey;
                const content = JSON.parse(msg.content.toString());

                try {
                    console.log(`[RabbitMQ] Processing event: ${routingKey}`);
                    await onMessage(content, routingKey);
                    channel.ack(msg);
                } catch (error) {
                    console.error(`[RabbitMQ] Error processing event: ${routingKey}. Sending to DLQ.`, error);
                    // nack without requeue will send to DLX
                    channel.nack(msg, false, false);
                }
            });
        });
    }
}

export const notificationBus = new NotificationBus();
