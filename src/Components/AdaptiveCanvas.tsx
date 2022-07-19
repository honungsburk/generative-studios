import { useEffect, useImperativeHandle, useRef } from "react";
import React from "react";
import useOnResize from "src/Hooks/useOnResize";

type AdaptiveCanvasProps = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

const adaptiveCanvasDefaultProps = { width: "100%", height: "100%" };

const AdaptiveCanvas = React.forwardRef(
  (props: AdaptiveCanvasProps, ref: React.Ref<HTMLCanvasElement>) => {
    const canvasWrapperRef = useRef<null | HTMLDivElement>(null);
    const canvasRef = useRef<null | HTMLCanvasElement>(null);
    useImperativeHandle(ref, () => canvasRef.current as any);

    const { width, height, ...rest } = {
      ...adaptiveCanvasDefaultProps,
      ...props,
    };

    useOnResize(
      canvasWrapperRef,
      (canvasWrapper) => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const scale = window.devicePixelRatio;
          canvas.width = Math.floor(canvasWrapper.clientWidth * scale);
          canvas.height = Math.floor(canvasWrapper.clientHeight * scale);
          canvas.style.width = `${canvasWrapper.clientWidth}px`;
          canvas.style.height = `${canvasWrapper.clientHeight}px`;
        }
      },
      [canvasWrapperRef]
    );

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
