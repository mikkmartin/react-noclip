import { useState } from "react";
import { useNoclip } from "react-noclip";

export default function Docs() {
  const [showHeader, setShowHeader] = useState(true);

  useNoclip({
    test: () => console.log("test"),
    bob: () => console.log("bob"),
    toggleHeader: () => setShowHeader(!showHeader),
  });

  return (
    <div>
      {showHeader && <h1>react-noclip Documentation</h1>}
      <input type="text" />
      <button>does nothing</button>
    </div>
  );
}
