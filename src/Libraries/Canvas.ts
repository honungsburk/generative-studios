/**
 *
 * @param width the width of the image
 * @param height the height of the image
 * @param name the name of the file
 * @param format the format to save in
 * @param render a function that takes the canvas and renders the image on it.
 */
export const save = async (
  width: number,
  height: number,
  name: string,
  format: "jpeg" | "png",
  render: (canvas: HTMLCanvasElement) => Promise<void>
): Promise<void> => {
  const offScreenCanvas = document.createElement("canvas");
  offScreenCanvas.width = width;
  offScreenCanvas.height = height;
  await render(offScreenCanvas);
  const type = `image/${format}`;
  const imageURI = offScreenCanvas
    .toDataURL(type, 1)
    .replace(type, "image/octet-stream");
  downloadURI(imageURI, name + "." + format);
  offScreenCanvas.remove();
};

/**
 *
 * @param uri the uri to download
 * @param name the name of the file
 */
function downloadURI(uri: string, name: string) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link.remove();
}
