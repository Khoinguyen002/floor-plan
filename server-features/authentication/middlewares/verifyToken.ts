import { NEXT_JWT_SECRET } from "@/config/envs";
import { verifyHMAC } from "@/server-features/authentication/utils/token";
import redis from "@/server-features/redis/services";
import { NextResponse } from "next/server";
import { Middleware } from "../types";
import {
  HMAC_PAYLOAD_HEADER,
  HMAC_SIGNATURE_HEADER,
  HMAC_TOKEN_TTL,
} from "@/config/token";

export const verifyToken: Middleware = async function (req, context, next) {
  if (!NEXT_JWT_SECRET) throw new Error("NEXT_JWT_SECRET is not defined");

  const signature = req.headers.get(HMAC_SIGNATURE_HEADER);
  const payload = req.headers.get(HMAC_PAYLOAD_HEADER);

  if (!signature || !payload) {
    return NextResponse.json({ error: "Malformed Request" }, { status: 401 });
  }

  try {
    const isValid = verifyHMAC(payload, signature);
    if (!isValid) throw new Error("Invalid token");

    const inserted = await redis.set(
      `used-token:${signature}`,
      "1",
      "EX",
      HMAC_TOKEN_TTL + 5,
      "NX"
    );
    if (!inserted) throw new Error("Replay detected");

    return next();
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Invalid token" },
      { status: 401 }
    );
  }
};
