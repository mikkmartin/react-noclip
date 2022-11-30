import { useEffect, useRef } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Content, Noclip } from "./Noclip";
import createCache, { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Dialog } from "./Dialog";

export function useNoclip(content: Content) {
  const mountedRef = useRef<boolean>(false);
  const rootNodeRef = useRef<ReactDOMClient.Root>();
  const cacheRef = useRef<EmotionCache>();
  const domNodeRef = useRef<HTMLDivElement>();
  const mountPointRef = useRef<ShadowRoot>();

  function mount() {
    mountedRef.current = true;
    domNodeRef.current = document.createElement("div");
    document.body.appendChild(domNodeRef.current);
    mountPointRef.current = domNodeRef.current.attachShadow({
      mode: "open",
    });
    cacheRef.current = createCache({
      key: "nc",
      container: mountPointRef.current,
    });
    rootNodeRef.current = ReactDOMClient.createRoot(mountPointRef.current);
    render();
  }

  function render() {
    if (!rootNodeRef.current) return;
    if (!mountPointRef.current) return;
    rootNodeRef.current.render(
      <CacheProvider value={cacheRef.current!}>
        <Dialog
          open={mountedRef.current}
          container={mountPointRef.current as unknown as HTMLDivElement}
          onUnmount={unmount}
        >
          <Noclip content={content} />
        </Dialog>
      </CacheProvider>
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
    if (e.key === "k" && e.metaKey && !mountedRef.current) mount();
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    if (mountedRef.current) render();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [content]);
}
