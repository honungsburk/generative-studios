import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

type CosineColorPickerProps = {
  width: number;
  height: number;
  bgColor: string;
};

export default function CosineColorInput(props: CosineColorPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const a = 0.5;
  const b = 0.2;
  const c = 2;
  const d = 0;

  const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pixelOffset = (1 - a) * canvas.height;
    const pixelAmplitude = b * canvas.height;

    const stepSize = 360 / canvas.width;

    ctx.moveTo(0, pixelOffset); // back to the left before drawing the sine

    for (let x = 0; x <= 360; x += stepSize) {
      // 360 steps (degrees) for entire sine period
      let y = pixelOffset - Math.sin((x * Math.PI) / 180) * pixelAmplitude; // calculate y flipped horizontally, converting from DEG to RADIAN
      ctx.lineTo(x, y); // draw the point
    }
    ctx.stroke();
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
