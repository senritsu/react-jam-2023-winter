import { playSoundEffect } from "sounds-some-sounds";
import { PawnUp } from "./icons/PawnUp";

export const CalloutButton = () => {
  return (
    <div className="buttons">
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
