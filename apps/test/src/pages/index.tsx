import { useState } from "react";
import { useNoclip } from "react-noclip";

export default function Docs() {
  const [buttons, setButtons] = useState({
    test: () => console.log("test"),
    test2: () => console.log("test"),
    test3: () => console.log("test"),
    test4: () => console.log("test"),
    test5: () => console.log("test"),
    test6: () => console.log("test"),
    test7: () => console.log("test"),
    test8: () => console.log("test"),
    test9: () => console.log("test"),
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
