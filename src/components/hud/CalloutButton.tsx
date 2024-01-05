import { playSoundEffect } from "sounds-some-sounds";
import { PawnUp } from "./icons/PawnUp";

import classes from "./Hud.module.css";

export const CalloutButton = () => {
  return (
    <div className={classes.buttons}>
      <button
        type="button"
        onClick={() => {
          playSoundEffect("select");
          Rune.actions.requestControl();
        }}
      >
        <PawnUp />
      </button>
    </div>
  );
};
