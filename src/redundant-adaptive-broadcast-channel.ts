import { BroadcastChannel } from "./broadcast-channel";
import * as LocalstorageMethod from "./methods/localstorage";
import * as NativeMethod from "./methods/native";
import * as ServerMethod from "./methods/server";
import * as SimulateMethod from "./methods/simulate";
import { EventType, IBroadcastChannel, Method, Options as BroadcastChannelOptions } from "./types";
import { log } from "./util";

type Nonce = `${number}-${number}`;

export type WrappedMessage = {
  nonce: Nonce;
  message: unknown;
};

/**
 * The RedundantAdaptiveBroadcastChannel class is designed to add fallback to during channel post message and synchronization issues between senders and receivers in a broadcast communication scenario. It achieves this by:
 * Creating a separate channel for each communication method, allowing all methods to listen simultaneously.
 * Implementing redundant message delivery by attempting to send messages through multiple channels when the primary channel fails.
 * Ensuring message delivery by using multiple communication methods simultaneously while preventing duplicate message processing.
 */
// oxlint-disable-next-line @typescript-eslint/no-explicit-any
export class RedundantAdaptiveBroadcastChannel<T = any> implements IBroadcastChannel<T> {
  name: string;

  options: BroadcastChannelOptions;

  closed: boolean;

  onML: ((event: T) => void) | null;

  methodPriority: Method["type"][];

  channels: Map<Method["type"], BroadcastChannel<T>>;

  listeners: Set<(message: T) => void>;

  processedNonces: Set<string>;

  nonce: number;

  constructor(name: string, options: BroadcastChannelOptions = {}) {
    this.name = name;
    this.options = options;
    this.closed = false;
    this.onML = null;
    // order from fastest to slowest
    this.methodPriority = [NativeMethod.type, LocalstorageMethod.type, ServerMethod.type];
    this.channels = new Map();
    this.listeners = new Set();
    this.processedNonces = new Set();
    this.nonce = 0;
    this.initChannels();
  }

  set onmessage(fn: ((data: T) => void) | null) {
    if (this.onML) this.removeEventListener("message", this.onML);
    if (fn && typeof fn === "function") {
      this.onML = fn;
      this.addEventListener("message", fn);
    } else {
      this.onML = null;
    }
  }

  initChannels() {
    // only use simulate if type simulate ( for testing )
    if (this.options.type === SimulateMethod.type) {
      this.methodPriority = [SimulateMethod.type];
    }

    // iterates through the methodPriority array, attempting to create a new BroadcastChannel for each method
    this.methodPriority.forEach((method) => {
      try {
        const channel = new BroadcastChannel(this.name, {
          ...this.options,
          type: method,
        });
        this.channels.set(method, channel as unknown as BroadcastChannel<T>);
        log.debug(`Succeeded to initialize ${method} method in channel ${this.name}`);
        // listening on every method
        channel.onmessage = (event) => this.handleMessage(event as WrappedMessage);
      } catch (error) {
        log.warn(`Failed to initialize ${method} method in channel ${this.name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    if (this.channels.size === 0) {
      throw new Error("Failed to initialize any communication method");
    }
  }

  allChannels(): Method["type"][] {
    return Array.from(this.channels.keys());
  }

  hasChannel(method: Method["type"]): boolean {
    return this.channels.has(method);
  }

  handleMessage(event: WrappedMessage) {
    if (event && event.nonce) {
      if (this.processedNonces.has(event.nonce)) {
        // log.debug(`Duplicate message received via ${method}, nonce: ${event.nonce}`);
        return;
      }
      this.processedNonces.add(event.nonce);

      // Cleanup old nonces (keeping last 1000 to prevent memory issues)
      if (this.processedNonces.size > 1000) {
        const nonces = Array.from(this.processedNonces);
        const oldestNonce = nonces.sort()[0]!;
        this.processedNonces.delete(oldestNonce);
      }

      this.listeners.forEach((listener) => {
        listener(event.message as T);
      });
    }
  }

  async postMessage(message: T): Promise<T> {
    if (this.closed) {
      throw new Error(
        "AdaptiveBroadcastChannel.postMessage(): " +
          `Cannot post message after channel has closed ${
            /**
             * In the past when this error appeared, it was realy hard to debug.
             * So now we log the msg together with the error so it at least
             * gives some clue about where in your application this happens.
             */
            JSON.stringify(message)
          }`
      );
    }

    const nonce = this.generateNonce();
    const wrappedMessage: WrappedMessage = { nonce, message };

    const postPromises = Array.from(this.channels.entries()).map(([method, channel]) =>
      channel.postMessage(wrappedMessage as unknown as T).catch((error) => {
        log.warn(`Failed to send via ${method}: ${error.message}`);
        throw error;
      })
    );

    const result = await Promise.allSettled(postPromises);

    // Check if at least one promise resolved successfully
    const anySuccessful = result.some((p) => p.status === "fulfilled");
    if (!anySuccessful) {
      throw new Error("Failed to send message through any method");
    }

    return message;
  }

  generateNonce(): Nonce {
    return `${Date.now()}-${this.nonce++}`;
  }

  addEventListener(_type: EventType, listener: (data: T) => void) {
    // type params is not being used, it's there to keep same interface as BroadcastChannel
    this.listeners.add(listener);
  }

  removeEventListener(_type: EventType, listener: (data: T) => void) {
    // type params is not being used, it's there to keep same interface as BroadcastChannel
    this.listeners.delete(listener);
  }

  async close() {
    if (this.closed) {
      return;
    }

    this.onML = null;

    // use for loop instead of channels.values().map because of bug in safari Map
    const promises = [];
    for (const c of this.channels.values()) {
      promises.push(c.close());
    }
    await Promise.all(promises);

    this.channels.clear();
    this.listeners.clear();

    this.closed = true;
  }
}
