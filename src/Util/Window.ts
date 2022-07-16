/**
 *
 * @param draw the function to call for each frame
 * @returns a function to cancel the drawing
 */
export function animate(draw: () => void): () => void {
  let animationFrameId = 0;
  const render = () => {
    draw();
    animationFrameId = window.requestAnimationFrame(render);
  };
  render();
  return () => {
    window.cancelAnimationFrame(animationFrameId);
  };
}
