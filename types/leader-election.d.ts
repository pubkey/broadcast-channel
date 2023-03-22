import {
    BroadcastChannel,
    OnMessageHandler
} from './broadcast-channel';

export type LeaderElectionOptions = {
    /**
     * Normally, when the leading JavaScript process dies, it will send an I-am-dead
     * message to the other LeaderElectors, so that they can elect a new leader.
     * On rare cases, when the JavaScript process exits ungracefully, it can happen
     * that the other electors do not get a dead-message.
     * So we have to also run the election cycle in an interval to ensure
     * we never stuck on a state where noone is leader and noone is trying to get elected.
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
     * The broadcastChannel with which the
     * leader elector was created.
     */
    readonly broadcastChannel: BroadcastChannel;

    /**
     * IMPORTANT: The leader election is lazy,
     * it will not start before you call awaitLeadership()
     * so isLeader will never become true then.
     */
    readonly isLeader: boolean;

    /**
     * Returns true if this or another instance is leader.
     * False if there is no leader at the moment
     * and we must wait for the election.
     */
    hasLeader(): Promise<boolean>;

    readonly isDead: boolean;
    readonly token: string;

    applyOnce(isFromFallbackInterval?: boolean): Promise<boolean>;
    awaitLeadership(): Promise<void>;
    die(): Promise<void>;

    /**
     * Add an event handler that is run
     * when it is detected that there are duplicate leaders
     */
    onduplicate: OnMessageHandler<any>;
}

type CreateFunction = (broadcastChannel: BroadcastChannel, options?: LeaderElectionOptions) => LeaderElector;

export const createLeaderElection: CreateFunction;
