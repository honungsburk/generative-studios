import { Box, useStyleConfig } from "@chakra-ui/react";
import Theme from "src/Theme";

import * as ThemeTools from "@chakra-ui/theme-tools";
import { useEffect, useRef } from "react";
import * as CanvasExtra from "src/Libraries/CanvasExtra";

type CoordinateInputProps = {
  width: number;
  height: number;
  bgColor: string;
  onPosition: (x: number, y: number) => void;
  x: number;
  y: number;
};

export default function CoordinateInput(
  props: CoordinateInputProps
): JSX.Element {
  // const styles = useStyleConfig(themeKey, props)
  // Theme["colors"][]
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorPositionRef = useRef([0, 0]);
  const positionRef = useRef([0, 0]);
  const cursorInsideCanvasRef = useRef(false);

  useEffect(() => {
    positionRef.current = [props.x, props.y];
  }, [props.x, props.y, props.width, props.height]);

  const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const [cursorX, cursorY] = cursorPositionRef.current;
    if (cursorInsideCanvasRef.current) {
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, 4, 0, 2 * Math.PI, true);
      ctx.fillStyle = "#FF6A6A";
      ctx.fill();
    }

    const [positionX, positionY] = positionRef.current;
    ctx.beginPath();
    ctx.arc(positionX, positionY, 4, 0, 2 * Math.PI, true);
    ctx.fillStyle = "#FF6A6A";
    ctx.fill();
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        let animationFrameId = 0;
        const render = () => {
          draw(ctx, canvas);
          animationFrameId = window.requestAnimationFrame(render);
        };
        render();

        return () => {
          window.cancelAnimationFrame(animationFrameId);
        };
      }
    }
  }, []);

  return (
    <Box
      bgColor={props.bgColor}
      rounded={8}
      width={`${props.width}px`}
      height={`${props.height}px`}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "inline-block" }}
        width={props.width}
        height={props.height}
        onMouseLeave={(e) => {
          cursorInsideCanvasRef.current = false;
        }}
        onMouseDown={(e) => {
          if (canvasRef.current) {
            const [x, y] = CanvasExtra.getCursorPosition(canvasRef.current, e);
            props.onPosition(x, y);
          }
        }}
        onMouseMove={(e) => {
          if (canvasRef.current) {
            cursorInsideCanvasRef.current = true;
            cursorPositionRef.current = CanvasExtra.getCursorPosition(
              canvasRef.current,
              e
            );
          }
        }}
      >
        Your browser does not support the HTML canvas tag.
      </canvas>
    </Box>
  );
}
