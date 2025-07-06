import { NextRequest, NextResponse } from "next/server";
import { HandlerContext, Middleware } from "../types";

export function applyMiddlewares(
  middlewares: Middleware[],
  handler: (req: NextRequest, context: HandlerContext) => Promise<NextResponse>
): (req: NextRequest, context: HandlerContext) => Promise<NextResponse> {
  return async function wrapped(req: NextRequest, context: HandlerContext) {
    let i = -1;

    async function dispatch(index: number): Promise<NextResponse> {
      if (index <= i) throw new Error("next() called multiple times");
      i = index;

      const fn = index === middlewares.length ? handler : middlewares[index];
      return fn(req, context, () => dispatch(index + 1));
    }

    return dispatch(0);
  };
}
