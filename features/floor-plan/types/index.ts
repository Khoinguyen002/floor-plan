import { QueryClient, Smplr } from "@smplrspace/smplr-loader";

export type SmplrContext = {
  smplr: Smplr | null;
  queryClient: QueryClient | null;
};

type Coordinate = {
  x: number;
  z: number;
  levelIndex: number;
};

export type Asset = {
  id: string;
  name: string;
  extras: {
    __lockMappingEdit: boolean;
    [key: string]: any;
  };
  mapped: boolean;
  layerType: "polygon" | string;
  levelIndex: number;
  coordinates: Coordinate[][];
  status: "available" | "reserved" | "maintenance" | "selected";
  selected?: boolean;
};

export type AssetRoom = {
  id: string;
  name: string;
  type: "polygon" | string;
  assets: Asset[];
};

export type AssetRooms = AssetRoom[];
