import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import * as MathExtra from "src/Libraries/MathExtra";

type CosineColorPickerProps = {
  width: number;
  height: number;
  bgColor: string;
};

export function CosineColorPicker(props: CosineColorPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 4, 0, 2 * Math.PI, true);
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
      >
        Your browser does not support the HTML canvas tag.
      </canvas>
    </Box>
  );
}

///////// Color Display

type CosineColorDisplayProps = {
  start: number;
  end: number;
  colorFn: ColorFn;
  width: number;
  height: number;
};

type ColorFn = (t: number) => [number, number, number, number];

export function CosineColorDisplay(props: CosineColorDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorFnRef = useRef<ColorFn>(() => [0, 0, 0, 0]);
  const startRef = useRef<number>(0);
  const endRef = useRef<number>(1);

  useEffect(() => {
    colorFnRef.current = props.colorFn;
    startRef.current = props.start;
    endRef.current = props.end;

    // Only rerenders when a value changes
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        draw(ctx, canvas);
      }
    }
  }, [props.colorFn, props.start, props.end, props.width, props.height]);

  const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const id = ctx.createImageData(1, canvas.height);
    const d = id.data;

    // We put an image data with the correct color acoss the entire height
    // for each x value
    for (let x = 0; x < canvas.width; x++) {
      const color = colorFnRef.current(
        MathExtra.map(x / canvas.width, startRef.current, endRef.current)
      );
      for (let y = 0; y < canvas.height; y++) {
        const pos = y * 4;
        d[pos + 0] = color[0];
        d[pos + 1] = color[1];
        d[pos + 2] = color[2];
        d[pos + 3] = color[3];
      }
      ctx.putImageData(id, x, 0);
    }
  };

  return (
    <Box rounded={8} width={`${props.width}px`} height={`${props.height}px`}>
      <canvas
        ref={canvasRef}
        style={{ display: "inline-block", borderRadius: 4 }}
        width={props.width}
        height={props.height}
      >
        Your browser does not support the HTML canvas tag.
      </canvas>
    </Box>
  );
}
