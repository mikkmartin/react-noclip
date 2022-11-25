import { useNoclip } from "react-noclip";

export default function Docs() {
  useNoclip({ test: () => console.log("test"), bob: () => {} });
  return (
    <div>
      <h1>react-noclip Documentation</h1>
    </div>
  );
}
