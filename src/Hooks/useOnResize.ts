import { RefObject, useEffect } from "react";

/**
 *
 * @param resize the function that runs every time `lead` is resized
 * @param leadRef the HTMLElement that we are tracking
 */
export default function useOnResize<A extends HTMLElement>(
  leadRef: RefObject<A>,
  resize: (lead: A) => void,
  deps: any[]
): void {
  useEffect(() => {
    const lead = leadRef.current;

    if (lead) {
      resize(lead);
      const observer = new ResizeObserver(() => resize(lead));
      observer.observe(lead);
      return () => observer.disconnect();
    }
  }, [leadRef, ...deps]);
}
