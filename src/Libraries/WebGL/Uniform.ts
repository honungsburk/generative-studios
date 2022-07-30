export type Uniform = F1 | F2 | F3;

export type F1 = [number];
export type F2 = [number, number];
export type F3 = [number, number, number];

export function isF1(x: Uniform): x is F1 {
  return x.length === 1;
}

export function isF2(x: Uniform): x is F2 {
  return x.length === 2;
}

export function isF3(x: Uniform): x is F3 {
  return x.length === 3;
}

export function equals(x: Uniform, y: Uniform): boolean {
  if (x.length !== y.length) {
    return false;
  }

  for (let i = 0; i < y.length; i++) {
    if (x[i] !== y[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Speedup setting uniforms by caching both the uniform value and the uniform location.
 */
export class Cache {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;

  private cache: Map<string, [WebGLUniformLocation, Uniform]>;

  constructor(gl: WebGL2RenderingContext, program: WebGLProgram) {
    this.gl = gl;
    this.program = program;
    this.cache = new Map();
  }

  /**
   * This function caches both locations and the current value of that location.
   * This ensures the minimal number of interacations with the GPU.
   *
   * @param location the name of the uniform (if it doesn exist it will throw an error)
   * @param value the value of the uniform
   */
  set(location: string, value: Uniform): void {
    const old = this.cache.get(location);

    if (old) {
      const [loc, oldValue] = old;
      if (!equals(value, oldValue)) {
        this.cache.set(location, [loc, value]);
        this.setValue(loc, value);
      }
    } else {
      const loc = this.gl.getUniformLocation(this.program, location);
      if (loc) {
        this.cache.set(location, [loc, value]);
        this.setValue(loc, value);
      } else {
        throw Error(`Uniform location '${location}' does not exist`);
      }
    }
  }

  private setValue(loc: WebGLUniformLocation, value: Uniform): void {
    if (isF1(value)) {
      this.gl.uniform1f(loc, value[0]);
    } else if (isF2(value)) {
      this.gl.uniform2f(loc, value[0], value[1]);
    } else if (isF3(value)) {
      this.gl.uniform3f(loc, value[0], value[1], value[2]);
    } else {
      throw Error(`Could not set uniform. '${value} is not a valid uniform'`);
    }
  }
}
