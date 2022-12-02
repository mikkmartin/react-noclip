import { RefObject, useEffect } from "react";

type Props = {
  ref: RefObject<HTMLElement>;
  attribute: string;
};

export const useAttributeChange = (
  { ref, attribute }: Props,
  callback?: (value: string | null) => void
) => {
  useEffect(() => {
    if (!ref.current) return;
    const observer = new MutationObserver(() => {
      const value = ref.current!.getAttribute(attribute) as string;
      callback && callback(value);
    });

    observer.observe(ref.current, {
      attributes: true,
      attributeFilter: [attribute],
      childList: false,
      subtree: false,
    });

    return () => observer.disconnect();
  }, []);
};
