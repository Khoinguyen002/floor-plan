import { NEXT_JWT_SECRET } from "@/config/envs";
import { fromBase64Url } from "@/utils/encode-decode";
import { createHmac, timingSafeEqual } from "crypto";

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUIDv4(jti: string): boolean {
  return UUID_V4_REGEX.test(jti);
}

export function signHMAC(data: string): string {
  if (!NEXT_JWT_SECRET) throw new Error("NEXT_JWT_SECRET is not defined");
  return createHmac("sha256", NEXT_JWT_SECRET).update(data).digest("hex");
}

export function verifyHMAC(data: string, signature: string): boolean {
  const raw = fromBase64Url(data);
  const payload = JSON.parse(raw) as {
    id: string;
    exp: number;
  };

  if (!payload.id || !payload.exp || !isValidUUIDv4(payload.id))
    throw new Error("Invalid token");

  if (payload.exp < Math.floor(Date.now() / 1000))
    throw new Error("Expired token");

  const expected = signHMAC(raw);

  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
