export interface AppConfig {
  throttler: {
    limit: number;
    ttl: number;
    blockDuration: number;
    ignoreUserAgents: RegExp[];
  };
}
