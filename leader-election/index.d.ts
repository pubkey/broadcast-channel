import BroadcastChannel from '../';

export type LeaderElectionOptions = {
    fallbackInterval?: number;
};


export declare class LeaderElector {

    readonly isLeader: boolean;
    readonly isDead: boolean;
    readonly token: string;

    applyOnce(): Promise<boolean>;
    awaitLeadership(): Promise<void>;
    die(): Promise<void>;


}

type CreateFunction = (channel: BroadcastChannel, options?: LeaderElectionOptions) => LeaderElector;

export const create: CreateFunction;

declare const _default: {
    create: CreateFunction,
};

export default _default;