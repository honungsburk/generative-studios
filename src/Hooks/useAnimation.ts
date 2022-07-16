import React from "react";

/**
 *
 * @param draw will be drawn for each frame
 * @return call to cancel the animation
 */
export default function useAnimation(draw: () => void): () => void {
  const animationFrameIdRef = React.useRef<number>(0);

  React.useEffect(() => {
    const render = () => {
      draw();
      animationFrameIdRef.current = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [draw]);

  return () => {
    window.cancelAnimationFrame(animationFrameIdRef.current);
  };
}
