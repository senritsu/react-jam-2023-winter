import { Canvas } from "@react-three/fiber";
import { Color, FogExp2 } from "three";

import classes from "./App.module.css";
import { GetReady } from "./components/intro/GetReady.tsx";
import { SceneContents } from "./components/game/SceneContents.tsx";
import { Hud } from "./components/hud/Hud.tsx";
import { useRuneStore } from "./runeStore.ts";
import { useSoundStore } from "./components/game/soundStore.ts";

function App() {
  const phase = useRuneStore((state) => state.game?.phase);
  const yourPlayerId = useRuneStore((state) => state.yourPlayerId);

  const audioAvailable = useSoundStore((state) => state.initialized);
  const initialize = useSoundStore((state) => state.initialize);

  if (!phase) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.container}>
      {phase === "title" && <GetReady onInteraction={initialize} />}
      {/* workaround for spectators not having interacted with the game*/}
      {phase !== "title" && !yourPlayerId && !audioAvailable && (
        <button onClick={initialize}>Tap here to spectate</button>
      )}
      {phase === "playing" && audioAvailable && (
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
