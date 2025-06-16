export interface AuthConfig {
  jwt: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenExpiresIn: number; // in seconds
    refreshTokenExpiresIn: number; // in seconds
  };
}
