import { useEffect, useImperativeHandle, useRef } from "react";
import { Property } from "csstype";
import React from "react";

// export type AdaptiveCanvasProps = {
//   setup?: (canvas: HTMLCanvasElement) => void;
//   width?: Property.Width<string | number>;
//   height?: Property.Width<string | number>;
// };

type AdaptiveCanvasProps = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

const adaptiveCanvasDefaultProps = { width: "100%", height: "100vh" };

const AdaptiveCanvas = React.forwardRef(
  (props: AdaptiveCanvasProps, ref: React.Ref<HTMLCanvasElement>) => {
    const canvasWrapperRef = useRef<null | HTMLDivElement>(null);
    const canvasRef = useRef<null | HTMLCanvasElement>(null);
    useImperativeHandle(ref, () => canvasRef.current as any);

    const { width, height, ...rest } = {
      ...adaptiveCanvasDefaultProps,
      ...props,
    };

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
        <canvas ref={canvasRef} {...rest}>
          Your browser does not support the HTML canvas tag.
        </canvas>
      </div>
    );
  }
);

AdaptiveCanvas.displayName = "AdaptiveCanvas";

export default AdaptiveCanvas;
