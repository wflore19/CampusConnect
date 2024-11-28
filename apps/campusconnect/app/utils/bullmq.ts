import { Queue, Worker, Job } from 'bullmq';
import { redis } from './redis';

export function createQueue(name: string) {
    return new Queue(name, { connection: redis });
}

export function createWorker<T>(
    name: string,
    processor: (job: Job) => Promise<T>
) {
    return new Worker(name, processor, { connection: redis });
}
