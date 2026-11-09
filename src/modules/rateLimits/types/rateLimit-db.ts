export type RateLimitDBModel = {
  ip: string;
  url: string;
  method: string;
  expiresAt: Date;
  payload: Record<string, unknown>;
};
