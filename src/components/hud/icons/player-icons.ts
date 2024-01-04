import { Sword } from "./Sword";
import { Shield } from "./Shield";
import { Bow } from "./Bow";
import { Book } from "./Book";
import { FC } from "react";

export const playerIconLookup: Record<string, FC> = {
  sword: Sword,
  shield: Shield,
  book: Book,
  bow: Bow,
};
