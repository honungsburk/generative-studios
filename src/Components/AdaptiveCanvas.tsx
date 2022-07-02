import { useEffect, useRef } from "react";
import { Property } from "csstype";

export type AdaptiveCanvasProps = {
  setup?: (canvas: HTMLCanvasElement) => void;
  width?: Property.Width<string | number>;
  height?: Property.Width<string | number>;
};

const adaptiveCanvasDefaultProps = { width: "100%", height: "100vh" };

export default function AdaptiveCanvas(props: AdaptiveCanvasProps) {
  const canvasWrapperRef = useRef<null | HTMLDivElement>(null);
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const { width, height } = { ...adaptiveCanvasDefaultProps, ...props };

  useEffect(() => {
    const canvasWrapper = canvasWrapperRef.current;
    const canvas = canvasRef.current;

    if (canvasWrapper && canvas) {
      const resize = () => {
        canvas.width = canvasWrapper.clientWidth;
        canvas.height = canvasWrapper.clientHeight;
        canvas.style.width = `${canvasWrapper.clientWidth}px`;
        canvas.style.height = `${canvasWrapper.clientHeight}px`;
      };

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(canvasWrapper);

      return () => observer.disconnect();
    }
  }, []);

  return (
    <div ref={canvasWrapperRef} style={{ width: width, height: height }}>
      <canvas ref={canvasRef}>
        Your browser does not support the HTML canvas tag.
      </canvas>
    </div>
  );
}
