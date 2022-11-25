import { Button } from "@noclip/core";
import { useIsomorphicLayoutEffect } from "@noclip/utils";

export default function Docs() {
  useIsomorphicLayoutEffect(() => {
    console.log("noclip docs page");
  }, []);
  return (
    <div>
      <h1>noclip Documentation</h1>
      <Button>Click me</Button>
    </div>
  );
}
