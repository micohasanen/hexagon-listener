/// <reference types="node" />
import { EventEmitter } from 'events';
import { QueueBaseOptions, RedisClient } from '../interfaces';
import { RedisConnection } from './redis-connection';
import { KeysMap } from './queue-keys';
export declare class QueueBase extends EventEmitter {
    readonly name: string;
    opts: QueueBaseOptions;
    toKey: (type: string) => string;
    keys: KeysMap;
    closing: Promise<void>;
    protected connection: RedisConnection;
    constructor(name: string, opts?: QueueBaseOptions, Connection?: typeof RedisConnection);
    get client(): Promise<RedisClient>;
    get redisVersion(): string;
    emit(event: string | symbol, ...args: any[]): boolean;
    waitUntilReady(): Promise<RedisClient>;
    protected base64Name(): string;
    protected clientName(): string;
    close(): Promise<void>;
    disconnect(): Promise<void>;
}
