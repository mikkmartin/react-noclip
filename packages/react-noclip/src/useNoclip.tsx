import { useEffect, useRef } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Content, Noclip } from "./Noclip";
import createCache, { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Dialog } from "./Dialog";
import { useAssignShortcuts } from "./utils/useAssignShortcuts";
import { NoclipProvider } from "./NoclipContext";

export function useNoclip(content: Content) {
  const mountedRef = useRef<boolean>(false);
  const rootNodeRef = useRef<ReactDOMClient.Root>();
  const cacheRef = useRef<EmotionCache>();
  const domNodeRef = useRef<HTMLDivElement>();
  const mountPointRef = useRef<ShadowRoot>();

  const [shortcuts, setShortcuts] = useAssignShortcuts(content);

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
    if (!cacheRef.current) return;
    rootNodeRef.current.render(
      <CacheProvider value={cacheRef.current}>
        <NoclipProvider shortcuts={shortcuts} setShortcuts={setShortcuts}>
          <Dialog open={mountedRef.current} onUnmount={unmount}>
            <Noclip content={content} />
          </Dialog>
        </NoclipProvider>
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
    if (e.key === "k" && (e.metaKey || e.ctrlKey) && !mountedRef.current) mount();
  };

  useEffect(() => {
    if (mountedRef.current) render();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [content, shortcuts]);
}
