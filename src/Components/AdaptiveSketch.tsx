import { useEffect, useRef } from "react";
import { Property } from "csstype";
import p5Types from "p5";
import { SketchProps } from "react-p5/@types";
import Sketch from "react-p5";
import React from "react";

export type AdaptiveSketchProps = {
  width?: Property.Width<string | number>;
  height?: Property.Width<string | number>;
  setup: (
    width: number,
    height: number
  ) => (p5: p5Types, CanvasParentRef: Element) => void;
  draw?: (width: number, height: number) => (p5: p5Types) => void;
};

const adaptiveSketchDefaultProps = { width: "100%", height: "100%" };

export default function AdaptiveSketch(
  props: AdaptiveSketchProps &
    Omit<SketchProps, "setup" | "draw" | "windowResized">
): JSX.Element {
  const { width, height, setup, draw, ...rest } = {
    ...adaptiveSketchDefaultProps,
    ...props,
  };
  const [canvasWidth, setCanvasWidth] = React.useState(400);
  const [canvasHeight, setCanvasHeight] = React.useState(400);

  useEffect(() => {
    const canvasWrapper = document.getElementById("wrapped-canvas-resizer");
    const canvases = document.getElementsByClassName("p5Canvas");
    const canvas = canvases.item(0) as HTMLCanvasElement | null;

    if (canvasWrapper && canvas) {
      const resize = () => {
        setCanvasWidth(canvasWrapper.clientWidth);
        setCanvasHeight(canvasWrapper.clientHeight);
        // P5JS usually deals with devicePixelRatio itself
        // But since we modify it directly we have to account for it!
        canvas.width = Math.floor(
          canvasWrapper.clientWidth * window.devicePixelRatio
        );
        canvas.height = Math.floor(
          canvasWrapper.clientHeight * window.devicePixelRatio
        );
        canvas.style.width = `${canvasWrapper.clientWidth}px`;
        canvas.style.height = `${canvasWrapper.clientHeight}px`;
      };

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(canvasWrapper);

      return () => observer.disconnect();
    }
  }, []);

  console.log("clientHeight", canvasHeight);
  console.log("clientWidth", canvasWidth);

  return (
    <div id="wrapped-canvas-resizer" style={{ width: width, height: height }}>
      <Sketch
        setup={setup(canvasWidth, canvasHeight)}
        draw={draw && draw(canvasWidth, canvasHeight)}
        {...rest}
      />
    </div>
  );
}
