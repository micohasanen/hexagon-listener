import { Redis, RedisOptions as BaseRedisOptions, ClusterOptions, Cluster } from 'ioredis';
export declare type RedisOptions = (BaseRedisOptions | ClusterOptions) & {
    skipVersionCheck?: boolean;
};
export declare type ConnectionOptions = RedisOptions | Redis | Cluster;
