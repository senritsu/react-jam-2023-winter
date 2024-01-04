import { PawnUp } from "./icons/PawnUp";

export const CalloutButton = () => {
  return (
    <div className="buttons">
      <button type="button" onClick={() => Rune.actions.requestControl()}>
        <PawnUp />
      </button>
    </div>
  );
};
