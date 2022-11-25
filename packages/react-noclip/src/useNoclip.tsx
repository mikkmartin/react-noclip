import { useEffect, useRef } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Content, Noclip } from "./Noclip";

export function useNoclip(content: Content) {
  const mountedRef = useRef<boolean>(false);
  const domNodeRef = useRef<HTMLDivElement>();
  const rootNodeRef = useRef<ReactDOMClient.Root>();

  function mount() {
    mountedRef.current = true;
    domNodeRef.current = document.createElement("div");
    domNodeRef.current.id = "noclip";
    document.body.appendChild(domNodeRef.current);
    rootNodeRef.current = ReactDOMClient.createRoot(domNodeRef.current);
    rootNodeRef.current.render(
      <Noclip
        domNode={domNodeRef.current}
        content={content}
        onUnmount={unmount}
      />
    );
  }

  function unmount() {
    if (!rootNodeRef.current) return;
    if (!domNodeRef.current) return;
    mountedRef.current = false;
    rootNodeRef.current.unmount();
    document.body.removeChild(domNodeRef.current);
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "k" && e.metaKey) {
      if (!mountedRef.current) mount();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
}
