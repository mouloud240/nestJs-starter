export interface AccessTokenPayload {
  sub: string; // User ID
  user: {
    id: string;
    email: string;
  };
}
