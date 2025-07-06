import { NextRequest, NextResponse } from "next/server";

export type HandlerContext = {
  params: Promise<{ [key: string]: string }>;
};

export type Middleware = (
  req: NextRequest,
  context: HandlerContext,
  next: () => Promise<NextResponse>
) => Promise<NextResponse>;
