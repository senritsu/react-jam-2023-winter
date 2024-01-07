import type { RuneClient } from "rune-games-sdk";

import type { GameActions, GameState } from "./logic.types";
import {
  checkGameover,
  expandLevel,
  incrementLevel,
  pruneSegments,
  updateCallouts,
  move,
  updateHealth,
  updateTitleScreen,
  updateEnemies,
  spawnEnemies,
} from "./logic.update";

// IBM Design Colors, color-blind safe, from https://davidmathlogic.com/colorblind
export const COLORS = ["#648FFF", "#785EF0", "#DC267F", "#FE6100", "#FFB000"];
export const ICONS = ["sword", "shield", "book", "bow"];
export const NOTES = ["D4", "E4", "F4", "G4"];

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

Rune.initLogic({
  minPlayers: 3,
  maxPlayers: 4,
  setup(allPlayerIds) {
    return {
      settings: {
        CALLOUTS_DURATION: 1100,
        STARTING_SPEED: 4,
        LEVEL_LENGTH: 100,
        SPEED_INCREMENT: 0.25,
        DAMAGE_PER_DISTANCE: 3,
        DAMAGE_INCREASE_PER_LEVEL: 0.1,
        HEAL_PER_DISTANCE: 0.4,
        SEGMENT_BUFFER_LENGTH: 100,
        MIN_SEGMENT_LENGTH: 10,
        MAX_SEGMENT_LENGTH: 20,
        ENEMY_COUNTDOWN: 4,
        ENEMY_COUNTDOWN_DECREMENT: 0.1,
        ENEMY_COUNTDOWN_MIN: 1,
        ENEMY_LIFETIME: 4,
        ENEMY_DAMAGE: 10,
      },
      phase: "title",
      paused: false,
      readyStatus: Object.fromEntries(allPlayerIds.map((id) => [id, false])),
      playerColors: Object.fromEntries(
        allPlayerIds.map((id, index) => [id, COLORS[index + 1]])
      ),
      playerIcons: Object.fromEntries(
        allPlayerIds.map((id, index) => [id, ICONS[index]])
      ),
      playerNotes: Object.fromEntries(
        allPlayerIds.map((id, index) => [id, NOTES[index]])
      ),
      segments: [],
      totalDistance: 0,
      currentLevel: 1,
      currentLevelBackground: "hsl(260, 40%, 10%)",
      currentSegmentId: 0,
      currentSegmentDistance: 0,
      correctPlayerIsInControl: true,
      health: 100,
      lastT: 0,
      callouts: [],
      enemyCountdown: 3,
      enemies: [],
    };
  },
  actions: {
    handOverControl({ targetPlayerId }, { game, playerId }) {
      if (playerId !== game.activePlayerId) {
        throw Rune.invalidAction();
      }

      game.activePlayerId = targetPlayerId;
    },
    requestControl(_, { game, playerId }) {
      if (playerId === game.activePlayerId) {
        throw Rune.invalidAction();
      }

      game.callouts.push({
        playerId,
        createdAt: Rune.gameTime(),
        position: [Math.random(), Math.random()],
      });
    },
    ready(_, { game, playerId }) {
      game.readyStatus[playerId] = !game.readyStatus[playerId];

      if (Object.values(game.readyStatus).every((x) => x)) {
        game.countdown = 3;
      } else {
        game.countdown = undefined;
      }
    },
    pause(_, { game }) {
      game.paused = !game.paused;
    },
    tap({ enemyId }, { game, playerId }) {
      const enemy = game.enemies.find((x) => x.id === enemyId);

      if (enemy && enemy.playerId === playerId) {
        game.enemies = game.enemies.filter((x) => x.id !== enemyId);
      }
    },
  },
  update: ({ game, allPlayerIds }) => {
    const t = Rune.gameTime();
    const dt = (t - game.lastT) / 1000;
    game.lastT = t;

    if (game.phase === "title") {
      updateTitleScreen({ game, allPlayerIds, dt });
    }

    if (game.phase === "playing") {
      if (!game.paused) {
        const distanceDelta = move({ game, dt });

        incrementLevel({ game });
        updateHealth({ game, distanceDelta });

        updateEnemies({ game, dt });
        spawnEnemies({ game, allPlayerIds, t, dt });
      }

      checkGameover({ game, allPlayerIds });

      updateCallouts({ game, t });

      expandLevel({ game, allPlayerIds });
      pruneSegments({ game });
    }
  },
  updatesPerSecond: 30,
});
