export const uniform1f =
  (gl: WebGL2RenderingContext) =>
  (program: WebGLProgram) =>
  (location: string, value: number): void => {
    let loc = gl.getUniformLocation(program, location);
    gl.uniform1f(loc, value);
  };

export const uniform2f =
  (gl: WebGL2RenderingContext) =>
  (program: WebGLProgram) =>
  (location: string, value1: number, value2: number): void => {
    let loc = gl.getUniformLocation(program, location);
    gl.uniform2f(loc, value1, value2);
  };

export const uniform3f =
  (gl: WebGL2RenderingContext) =>
  (program: WebGLProgram) =>
  (location: string, value1: number, value2: number, value3: number): void => {
    let loc = gl.getUniformLocation(program, location);
    gl.uniform3f(loc, value1, value2, value3);
  };
