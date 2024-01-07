import { TrackSegment } from "./logic.levelGeneration";
import { Vector3 } from "./logic.math";

export type GameSettings = {
  CALLOUTS_DURATION: number;
  // difficulty
  STARTING_SPEED: number;
  LEVEL_LENGTH: number;
  SPEED_INCREMENT: number;
  DAMAGE_PER_DISTANCE: number;
  DAMAGE_INCREASE_PER_LEVEL: number;
  HEAL_PER_DISTANCE: number;
  // level stuff
  SEGMENT_BUFFER_LENGTH: number;
  MIN_SEGMENT_LENGTH: number;
  MAX_SEGMENT_LENGTH: number;
  ENEMY_COUNTDOWN: number;
  ENEMY_COUNTDOWN_DECREMENT: number;
  ENEMY_COUNTDOWN_MIN: number;
  ENEMY_LIFETIME: number;
  ENEMY_DAMAGE: number;
};

export type Enemy = {
  id: string;
  playerId: string;
  positions: Vector3[];
  createdAt: number;
  lifetime: number;
};

export interface GameState {
  settings: GameSettings;
  phase: "title" | "playing";
  paused: boolean;
  readyStatus: Record<string, boolean>;
  countdown?: number;
  playerColors: Record<string, string>;
  playerIcons: Record<string, string>;
  playerNotes: Record<string, string>;
  callouts: {
    playerId: string;
    createdAt: number;
    position: [number, number];
  }[];
  segments: Record<number, TrackSegment>;
  totalDistance: number;
  currentLevel: number;
  currentLevelBackground: string;
  currentSegmentId: number;
  currentSegmentDistance: number;
  activePlayerId?: string;
  correctPlayerIsInControl: boolean;
  health: number;
  lastT: number;
  enemyCountdown: number;
  enemies: Enemy[];
}

export type GameActions = {
  handOverControl: (params: { targetPlayerId: string }) => void;
  requestControl: () => void;
  ready: () => void;
  pause: () => void;
  tap: (params: { enemyId: string }) => void;
};
