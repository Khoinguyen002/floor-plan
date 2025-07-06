import { trustedRequest } from "@/server-features/authentication/middlewares/trustedRequest";
import { verifyToken } from "@/server-features/authentication/middlewares/verifyToken";
import { applyMiddlewares } from "@/server-features/authentication/utils/applyMiddlewares";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  return NextResponse.json({
    message: "This is protected data from App Router.",
  });
}

export const GET = applyMiddlewares([trustedRequest, verifyToken], handler);
export const POST = applyMiddlewares([trustedRequest, verifyToken], handler);
