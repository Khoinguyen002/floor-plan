export const SMPLR_ORGANIZATION_ID = "0be6757f-8db7-4558-bd3d-86171f3d86b9";
export const SMPLR_SPACE_ID = "spc_fhi1hrb0";
export const SMPLR_CLIENT_TOKEN = "pub_f9e0e1d4fd0543f0ba9d528e1baf7219";

export const NEXT_DOMAIN = process.env.NEXT_PUBLIC_NEXT_DOMAIN;
export const NEXT_JWT_MAX_AGE_SECONDS =
  process.env.NEXT_PUBLIC_JWT_MAX_AGE_SECONDS;
export const NEXT_JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

export const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;
