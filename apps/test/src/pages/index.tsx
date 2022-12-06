import { useState } from "react";
import { useNoclip } from "react-noclip";
import { motion } from "framer-motion";

export default function Docs() {
  const [showHeader, setShowHeader] = useState(true);
  const [key, setKey] = useState(0);

  useNoclip({
    test: () => console.log("test"),
    bob: () => console.log("bob"),
    toggleHeader: () => setShowHeader(!showHeader),
    restartAnimation: () => setKey(key + 1),
  });

  return (
    <div
      style={{
        padding: "10rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 10,
        alignItems: "center",
      }}
    >
      {showHeader && (
        <motion.h1
          key={key}
          transition={{ type: "spring", bounce: 200, damping: 20 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          react-noclip Documentation
        </motion.h1>
      )}
      <input type="text" />
      <button>does nothing</button>
    </div>
  );
}
