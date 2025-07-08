"use client";

import React, { useEffect, useRef, useState } from "react";
import useSmplr from "../hooks/useSmplr";
import { SMPLR_CLIENT_TOKEN, SMPLR_SPACE_ID } from "@/config/envs";
import { Asset, AssetRooms } from "../types";
import nextAxiosInstance from "@/config/next-axios";
import clsx from "clsx";
import { Button } from "@heroui/button";
import { PolygonDataLayer, Space } from "@smplrspace/smplr-loader";

const FloorPlan = () => {
  const { queryClient, smplr } = useSmplr();
  const [visible, setVisible] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [levels, setLevels] = useState<any[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<
    PolygonDataLayer<Asset>["data"]
  >([]);
  const spaceRef = useRef<Space>();

  useEffect(() => {
    if (!smplr) return;
    const space = new smplr.Space({
      clientToken: SMPLR_CLIENT_TOKEN,
      containerId: "test",
      spaceId: SMPLR_SPACE_ID,
    });

    spaceRef.current = space;

    smplr.Color.drawColorSwatches({
      containerId: "smplr-legend",
      size: 24,
      swatches: [
        {
          color: "#FFC107",
          label: "Warning",
        },
        {
          color: "#4CAF50",
          label: "Available",
        },
        {
          color: "#9E9E9E",
          label: "Selected",
        },
        {
          color: "#1E1E2F",
          label: "Unavailable",
        },
      ],
    });

    space.startViewer({
      mode: "2d",
      renderOptions: { compass: false },
      allowModeChange: true,
      // disableCameraRotation: true,
      // disableCameraControls: true,
      // hideControls: true,
      topShownLevel: 0,
      // hideLevelPicker: true,
      // hideNavigationButtons: true,
      loadingMessage: "Epiisod",
      controlsPosition: "bottom-left",
      onReady: async () => {
        setLevels(space.getDefinition().levels);
        const { data: rooms } = await nextAxiosInstance<Asset[]>(
          "/api/smplr?spaceID=" + SMPLR_SPACE_ID
        );

        const spaceDataLayerController = space.addDataLayer<Asset>({
          id: "rooms",
          type: "polygon",
          data: rooms,
          color(dataElement) {
            if (dataElement.selected) return "#9E9E9E";

            return dataElement.status === "available"
              ? "#4CAF50"
              : dataElement.status === "maintenance"
                ? "#FFC107"
                : dataElement.status === "reserved"
                  ? "#1E1E2F"
                  : "none";
          },
          alpha: 0.5,
          onClick(dataElement) {
            if (!dataElement.id || dataElement.status !== "available") return;

            setSelectedRooms((prev) => {
              const result = prev.some(
                (room) => room.id === String(dataElement.id)
              )
                ? prev.filter((room) => room.id !== dataElement.id)
                : [...prev, dataElement];

              spaceDataLayerController.update({
                data: rooms.map((asset) => ({
                  ...asset,
                  selected: result.some((room) => room.id === String(asset.id)),
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
      <strong>Use Ctrl + Drag to drag on the floor plan</strong>
      <div
        id="test"
        className={clsx(
          "aspect-1 sm:aspect-[16/9] flex items-center justify-center"
        )}
      ></div>
      <div id="smplr-legend" className="mx-auto flex justify-center py-4"></div>
      <div className="flex">
        <p>Selected rooms:</p>&nbsp;
        {selectedRooms.map((room) => room.name).join(", ")}
      </div>
    </>
  );
};

export default FloorPlan;
