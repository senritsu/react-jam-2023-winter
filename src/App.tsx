import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import classes from "./App.module.css";
import { GameState } from "./logic.ts";
import { Color, FogExp2 } from "three";
import { SceneContents } from "./components/game/SceneContents.tsx";
import { Players } from "rune-games-sdk";
import { Hud } from "./components/hud/Hud.tsx";
import { GetReady } from "./components/intro/GetReady.tsx";
import { useAudio } from "./App.useAudio.ts";

function App() {
  const [game, setGame] = useState<GameState>();
  const [yourPlayerId, setYourPlayerId] = useState<string>();
  const [players, setPlayers] = useState<Players>();
  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, players, yourPlayerId }) => {
        setGame(game);
        setYourPlayerId(yourPlayerId);
        setPlayers(players);
      },
    });
  }, []);

  useAudio();

  if (!game || !players) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.container}>
      {game.phase === "title" && (
        <GetReady game={game} yourPlayerId={yourPlayerId} />
      )}
      {game.phase === "playing" && (
        <>
          <Canvas
            scene={{
              background: new Color("hsl(260, 40%, 10%)"),
              fog: new FogExp2(new Color("hsl(260, 40%, 10%)"), 0.05),
            }}
          >
            <SceneContents game={game} yourPlayerId={yourPlayerId} />
          </Canvas>

          {yourPlayerId && (
            <Hud game={game} yourPlayerId={yourPlayerId} players={players} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
