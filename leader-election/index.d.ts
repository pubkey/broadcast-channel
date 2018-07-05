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

export function create(channel: BroadcastChannel, options?: LeaderElectionOptions): LeaderElector;

declare const _default: {
    create;
}

export default _default;