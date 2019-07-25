import BroadcastChannel from '../';

export type LeaderElectionOptions = {
    /**
     * This value decides how often instances will renegotiate who is leader.
     * Probably should be at least 2x bigger than responseTime.
     */
    fallbackInterval?: number;
    /**
     * This timer value is used when resolving which instance should be leader.
     * In case when your application elects more than one leader increase this value.
     */
    responseTime?: number;
};


export declare class LeaderElector {

    /**
     * IMPORTANT: The leader election is lazy,
     * it will not start before you call awaitLeadership()
     * so isLeader will never become true then
     */
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
