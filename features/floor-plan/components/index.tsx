"use client";

import React, { useEffect, useState } from "react";
import useSmplr from "../hooks/useSmplr";
import { SMPLR_CLIENT_TOKEN, SMPLR_SPACE_ID } from "@/config/envs";
import { Asset, AssetRooms } from "../types";
import nextAxiosInstance from "@/config/next-axios";
import clsx from "clsx";

const FloorPlan = () => {
  const { queryClient, smplr } = useSmplr();
  const [visible, setVisible] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  useEffect(() => {
    if (!smplr) return;
    const space = new smplr.Space({
      clientToken: SMPLR_CLIENT_TOKEN,
      containerId: "test",
      spaceId: SMPLR_SPACE_ID,
    });

    smplr.Color.drawColorSwatches({
      containerId: "smplr-legend",
      size: 24,
      swatches: [
        {
          color: "orange",
          label: "Warning",
        },
        {
          color: "green",
          label: "All ok",
        },
        {
          color: "blue",
          label: "Selected",
        },
      ],
    });
    space.startViewer({
      mode: "2d",
      compass: false,
      //   disableCameraRotation: true,
      //   disableCameraControls: true,
      allowModeChange: true,
      topShownLevel: 0,
      loadingMessage: "asdasd",
      controlsPosition: "bottom-right",
      onReady: async () => {
        const { data: rooms } = await nextAxiosInstance<Asset[]>(
          "/api/smplr?spaceID=" + SMPLR_SPACE_ID
        );

        const spaceDataLayerController = space.addDataLayer<Asset>({
          id: "rooms",
          type: "polygon",
          data: rooms,
          color(dataElement) {
            if (dataElement.selected) return "blue";

            return dataElement.status === "available"
              ? "green"
              : dataElement.status === "maintenance"
                ? "yellow"
                : dataElement.status === "reserved"
                  ? "black"
                  : "none";
          },
          alpha: 0.5,
          onClick(dataElement) {
            if (!dataElement.id || dataElement.status !== "available") return;

            setSelectedRooms((prev) => {
              const result = prev.includes(String(dataElement.id))
                ? prev.filter((id) => id !== dataElement.id)
                : [...prev, String(dataElement.id)];

              spaceDataLayerController.update({
                data: rooms.map((asset) => ({
                  ...asset,
                  selected: result.includes(asset.id),
                })),
              });
              return result;
            });
          },
        });
        setVisible(true);
      },
    });
  }, [smplr]);

  return (
    <>
      <div
        id="test"
        className={clsx(
          "w-full aspect-[2464/1232] flex items-center justify-center"
        )}
      ></div>
      <div id="smplr-legend" className="mx-auto flex justify-center"></div>
      {selectedRooms.join(", ")}
    </>
  );
};

export default FloorPlan;
