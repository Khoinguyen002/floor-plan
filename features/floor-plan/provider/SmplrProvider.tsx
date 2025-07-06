"use client";

import { SMPLR_CLIENT_TOKEN, SMPLR_ORGANIZATION_ID } from "@/config/envs";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { SmplrContext } from "../types";

export const smplrContext = createContext<SmplrContext>({
  smplr: null,
  queryClient: null,
});

const SmplrProvider = ({ children }: PropsWithChildren) => {
  const [smplrContextValue, setSmplrContextValue] = useState<SmplrContext>({
    queryClient: null,
    smplr: null,
  });

  useEffect(() => {
    const handleSetSmplrContextState = () => {
      if (window.smplr) {
        const queryClient = new window.smplr.QueryClient({
          clientToken: SMPLR_CLIENT_TOKEN,
          organizationId: SMPLR_ORGANIZATION_ID,
        });
        setSmplrContextValue({ queryClient, smplr: window.smplr });
      }
    };

    if (document.getElementById("smplr-script") && window.smplr) {
      handleSetSmplrContextState();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://app.smplrspace.com/lib/smplr.js";
    script.id = "smplr-script";
    script.async = true;
    script.addEventListener("load", handleSetSmplrContextState);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (document.getElementById("smplr-style")) return;

    const link: HTMLLinkElement = document.createElement("link");
    link.type = "text/css";
    link.href = "https://app.smplrspace.com/lib/smplr.css";
    link.rel = "stylesheet";
    link.id = "smplr-style";

    document.head.appendChild(link);
  }, []);

  return (
    <smplrContext.Provider value={smplrContextValue}>
      {children}
    </smplrContext.Provider>
  );
};

export default SmplrProvider;
