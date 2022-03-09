import { JobsOptions, RepeatOptions } from '../interfaces';
import { QueueBase } from './queue-base';
import { Job } from './job';
export declare class Repeat extends QueueBase {
    addNextRepeatableJob<T = any, R = any, N extends string = string>(name: N, data: T, opts: JobsOptions, skipCheckExists?: boolean): Promise<Job<T, R, N>>;
    private createNextJob;
    removeRepeatable(name: string, repeat: RepeatOptions, jobId?: string): Promise<void>;
    removeRepeatableByKey(repeatJobKey: string): Promise<void>;
    private keyToData;
    getRepeatableJobs(start?: number, end?: number, asc?: boolean): Promise<{
        key: string;
        name: string;
        id: string;
        endDate: number;
        tz: string;
        cron: string;
        next: number;
    }[]>;
    getRepeatableCount(): Promise<number>;
}
