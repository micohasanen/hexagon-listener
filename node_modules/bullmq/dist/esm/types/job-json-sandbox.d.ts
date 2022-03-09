import { JobJson, ParentKeys } from '../interfaces';
export declare type JobJsonSandbox = JobJson & {
    queueName: string;
    parent?: ParentKeys;
    prefix: string;
};
