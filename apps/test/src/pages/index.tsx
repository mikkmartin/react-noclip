import { useState } from "react";
import { useNoclip } from "react-noclip";

export default function Docs() {
  const [buttons, setButtons] = useState({
    test: () => console.log("test"),
    bob: () => console.log("bob"),
  });

  useNoclip({
    ...buttons,
    addNew: {
      title: "text-input",
      urls: "text-area",
      onSubmit: (values: any) => {
        setButtons((buttons) => ({
          ...buttons,
          [values.title]: () => console.log(values.urls),
        }));
      },
    },
  });

  return (
    <div>
      <h1>react-noclip Documentation</h1>
      <pre>{JSON.stringify(Object.keys(buttons), null, 2)}</pre>
      <input type="text" />
      <button>does nothing</button>
    </div>
  );
}
