import { AMQPClient, AMQPQueue, AMQPChannel } from '@cloudamqp/amqp-client';

export let log: AMQPQueue;
export let accountsQueue: AMQPQueue;

export async function amqpConnect() {
    try {
        const client: AMQPClient = new AMQPClient(String(process.env.AMQP_URL))
        const connection = await client.connect()
        const channel: AMQPChannel = await connection.channel()

        log = await channel.queue(String(process.env.LOGS_QUEUE_NAME))
        accountsQueue = await channel.queue(String(process.env.ACCOUNTS_QUEUE_NAME))

        console.log("AMQP connection successfully established!");

    } catch (e) {
        console.error("ERROR", e);
        process.exit(1);
    }
}