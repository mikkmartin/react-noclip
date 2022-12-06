import { useEffect } from "react";
import type { Content } from "../Noclip";
import { LOCALSTORAGE_SHORTCUTS } from "./constants";
import useLocalStorage from "./useLocalStorage";

export const useAssignShortcuts = (content: Content) => {
  const stortcuts = useLocalStorage<{
    [key: string]: string;
  }>(LOCALSTORAGE_SHORTCUTS);

  const [shortcutObject] = stortcuts;

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (!shortcutObject) return;
      Object.keys(shortcutObject).map((key) => {
        const keysString = shortcutObject[key];
        const keys = keysString
          .split("")
          .map((key) =>
            key
              .replace("⌘", "Meta")
              .replace("⌥", "Alt")
              .replace("⌃", "Control")
              .replace("⇧", "Shift")
          );
        const letterKey = keysString
          .replace("⌘", "")
          .replace("⌥", "")
          .replace("⌃", "")
          .replace("⇧", "")
          .toLowerCase();
        if (
          e.key.toLocaleLowerCase() === letterKey &&
          keys.includes("Meta") === e.metaKey &&
          keys.includes("Alt") === e.altKey &&
          keys.includes("Control") === e.ctrlKey &&
          keys.includes("Shift") === e.shiftKey &&
          typeof content[key] === "function"
        ) {
          (content[key] as Function)();
        }
      });
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [content, shortcutObject]);

  return stortcuts;
};
