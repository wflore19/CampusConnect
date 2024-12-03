import { Queue, Worker, Job } from 'bullmq';
import { redis } from './redis';

/**
 * Create a new queue with the given name.
 * A queue is a list of jobs that are waiting to be processed.
 * @param name
 * @returns
 */
export function createQueue(name: string) {
    return new Queue(name, { connection: redis });
}

/**
 * Create a new worker with the given name and processor.
 * A worker is a process that processes jobs from a queue.
 * @param name - The name of the worker.
 * @param processor - The function that processes the job.
 * @returns
 */
export function createWorker<T>(
    name: string,
    processor: (job: Job) => Promise<T>
) {
    return new Worker(name, processor, { connection: redis });
}
