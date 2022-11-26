import { useNoclip } from "react-noclip";

export default function Docs() {
  useNoclip({
    test: () => console.log("test"),
    bob: () => console.log("test"),
  });
  return (
    <div>
      <h1>react-noclip Documentation</h1>
    </div>
  );
}
