import { PawnUp } from "./icons/PawnUp";

import classes from "./Hud.module.css";

export const CalloutButton = () => {
  return (
    <div className={classes.buttons}>
      <button
        type="button"
        onClick={() => {
          Rune.actions.requestControl();
        }}
      >
        <PawnUp />
      </button>
    </div>
  );
};
