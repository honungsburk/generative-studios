import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

type CosineColorPickerProps = {
  width: number;
  height: number;
  bgColor: string;
};

export default function CosineColorInput(props: CosineColorPickerProps) {
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
