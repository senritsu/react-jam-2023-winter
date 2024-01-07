import { useEffect } from "react";

const pauseHandler = (event: KeyboardEvent) => {
  if (event.key === " ") {
    Rune.actions.pause();
  }
};

export const usePause = () => {
  useEffect(() => {
    document.addEventListener("keydown", pauseHandler);

    return () => {
      document.removeEventListener("keydown", pauseHandler);
    };
  }, []);
};
