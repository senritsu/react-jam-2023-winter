import { Canvas } from "@react-three/fiber";
import { Color, FogExp2 } from "three";

import classes from "./App.module.css";
import { useAudio } from "./App.useAudio.ts";
import { GetReady } from "./components/intro/GetReady.tsx";
import { SceneContents } from "./components/game/SceneContents.tsx";
import { Hud } from "./components/hud/Hud.tsx";
import { useRuneStore } from "./runeStore.ts";
import { useEffect } from "react";

const pauseHandler = (event: KeyboardEvent) => {
  if (event.key === "Space") {
    Rune.actions.pause();
  }
};

function App() {
  useAudio();

  const phase = useRuneStore((state) => state.game?.phase);

  useEffect(() => {
    document.addEventListener("keydown", pauseHandler);

    return () => {
      document.removeEventListener("keydown", pauseHandler);
    };
  }, []);

  if (!phase) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.container}>
      {phase === "title" && <GetReady />}
      {phase === "playing" && (
        <>
          <Canvas
            scene={{
              background: new Color("hsl(260, 40%, 10%)"),
              fog: new FogExp2(new Color("hsl(260, 40%, 10%)"), 0.05),
            }}
          >
            <SceneContents />
          </Canvas>

          <Hud />
        </>
      )}
    </div>
  );
}

export default App;
