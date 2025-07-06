import { Asset, AssetRooms } from "@/features/floor-plan/types";
import { trustedRequest } from "@/server-features/authentication/middlewares/trustedRequest";
import { verifyToken } from "@/server-features/authentication/middlewares/verifyToken";
import { HandlerContext } from "@/server-features/authentication/types";
import { applyMiddlewares } from "@/server-features/authentication/utils/applyMiddlewares";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  const spaceID = req.nextUrl.searchParams.get("spaceID");

  if (!spaceID) {
    return NextResponse.json({ error: "Missing spaceID" }, { status: 400 });
  }

  const res = await await fetch(
    "https://api.smplrspace.com/smplrjs/getSpaceById?" +
      `input={"spaceId":"${spaceID}"}`,
    {
      headers: {
        ["x-smplr-internal"]: "false",
        ["x-smplrspace-client-token"]: "pub_f9e0e1d4fd0543f0ba9d528e1baf7219",
        ["x-smplrspace-organization-id"]:
          "0be6757f-8db7-4558-bd3d-86171f3d86b9",
      },
      method: "GET",
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Smplr API failed", details: await res.json() },
      { status: 500 }
    );
  }

  const rooms = (
    (await res.json()).result.data.assetmap as AssetRooms
  ).flatMap<Asset>((room) =>
    room.assets.map((asset) => {
      const randomValue = Math.random();
      return {
        ...asset,
        status:
          randomValue > 0.7
            ? "reserved"
            : randomValue > 0.5
              ? "maintenance"
              : "available",
      };
    })
  );

  return NextResponse.json(rooms);
}

export const GET = applyMiddlewares([trustedRequest, verifyToken], handler);
export const POST = applyMiddlewares([trustedRequest, verifyToken], handler);
