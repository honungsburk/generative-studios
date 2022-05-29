/**
 *
 * @param canvas the canvas to get the position within
 * @param event the mouse click
 * @returns
 */
export function getCursorPosition(
  canvas: HTMLCanvasElement,
  event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return [x, y];
}
