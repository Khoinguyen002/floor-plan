import { NEXT_DOMAIN } from "@/config/envs";
import { NextResponse } from "next/server";
import { Middleware } from "../types";

export const trustedRequest: Middleware = async function (
  req,
  context,
  next
): Promise<NextResponse> {
  if (!NEXT_DOMAIN) throw new Error("NEXT_DOMAIN is not defined");

  const userAgent = req.headers.get("user-agent") || "";
  const host = req.headers.get("host") || "";
  const method = req.method;

  const isBrowserAgent =
    /Mozilla|Chrome|Safari|Firefox|Edge/.test(userAgent) &&
    !/Postman|curl|Insomnia/i.test(userAgent);

  const isSameHost = host.includes(NEXT_DOMAIN);
  const isMethodSafe = ["GET", "POST", "HEAD"].includes(method);

  const trusted = isBrowserAgent && isMethodSafe && isSameHost;

  if (!trusted) {
    return NextResponse.json({ error: "Untrusted request" }, { status: 403 });
  }

  return next();
};
