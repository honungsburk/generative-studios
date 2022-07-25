import { useBoolean } from "@chakra-ui/react";
import { RefObject, useEffect } from "react";

export function useFullscreen(
  ref: RefObject<HTMLElement | undefined>
): [boolean, { enter: () => void; exit: () => void; toggle: () => void }] {
  const [isFullScreen, setIsFullScreen] = useBoolean(false);

  useEffect(() => {
    const fn = (e: Event) => {
      if (document.fullscreenElement === ref.current) {
        setIsFullScreen.on();
      } else {
        setIsFullScreen.off();
      }
    };
    document.addEventListener("fullscreenchange", fn);

    return () => {
      document.removeEventListener("fullscreenchange", fn);
    };
  }, []);

  return [
    isFullScreen,
    {
      enter: async () => {
        if (document.fullscreenEnabled && ref.current) {
          await ref.current.requestFullscreen({ navigationUI: "show" });
          setIsFullScreen.on();
        }
      },
      exit: async () => {
        if (document.fullscreenEnabled) {
          await document.exitFullscreen();
          setIsFullScreen.off();
        }
      },
      toggle: async () => {
        if (document.fullscreenEnabled && ref.current) {
          if (document.fullscreenElement) {
            await document.exitFullscreen();
            setIsFullScreen.off();
          } else {
            await ref.current.requestFullscreen({ navigationUI: "show" });
            setIsFullScreen.on();
          }
        }
      },
    },
  ];
}
