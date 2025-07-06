import { useContext } from "react";
import { smplrContext } from "../provider/SmplrProvider";

const useSmplr = () => {
  const context = useContext(smplrContext);
  if (!context) {
    throw new Error("Smplr context is not available");
  }

  return context;
};

export default useSmplr;
