/**
 *
 * @param path the path to the file to load
 * @returns
 */
function loadAsString(path: string): Promise<string> {
  return fetch(path).then((response) => response.text());
}

/**
 *
 * @param {webglContext} gl - the webgl context
 * @param {ShaderKind} shaderKind the type of shader
 * @param {string} path - path to where the shader source code is stores
 * @returns a compiled shader or throws error
 */
export const loadShader =
  (gl: WebGL2RenderingContext) =>
  async (shaderKind: number, path: string): Promise<WebGLShader> => {
    const source = await loadAsString(path);
    const shader = gl.createShader(shaderKind);

    if (!shader) {
      // TODO: create my own error class
      throw new Error("Could not create shader");
    } else {
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      const error = gl.getShaderInfoLog(shader);
      if (error && error.length > 0) {
        throw error;
      }
      return shader;
    }
  };

/**
 *  Will consume the shaders it is given!
 *
 * @param gl the webgl context to create the program within
 * @returns
 */
export const createProgram =
  (gl: WebGL2RenderingContext) =>
  (...shaders: WebGLShader[]): WebGLProgram => {
    let program = gl.createProgram();

    if (!program) {
      throw Error("Could not create program. Got null instead");
    } else {
      for (let shader of shaders) {
        gl.attachShader(program, shader);
      }

      gl.linkProgram(program);

      for (let shader of shaders) {
        gl.detachShader(program, shader);
      }

      for (let shader of shaders) {
        gl.deleteShader(shader);
      }

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw gl.getProgramInfoLog(program);
      }
    }
    return program;
  };
