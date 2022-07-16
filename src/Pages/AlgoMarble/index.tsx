import { useEffect, useRef } from "react";
import AdaptiveCanvas from "src/Components/AdaptiveCanvas";
import { RNG } from "src/Libraries/Random";
import { uniform1f, uniform2f, uniform3f } from "src/Libraries/WebGL/uniform";
import * as WebGL from "src/Libraries/WebGL";
import vertexShaderPath from "./Shaders/shader.vert?url";
import fragShaderPath from "./Shaders/shader.frag?url";
import * as Window from "src/Util/Window";
export default function AlgoMarble() {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);

  // TODO: add cleanup
  useEffect(() => {
    const exec = async () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl2");
        if (gl) {
          const vert = await WebGL.loadShader(gl)(
            gl.VERTEX_SHADER,
            vertexShaderPath
          );
          const frag = await WebGL.loadShader(gl)(
            gl.FRAGMENT_SHADER,
            fragShaderPath
          );
          const program = WebGL.createProgram(gl)(vert, frag);
          gl.useProgram(program);
          setUniforms(gl)(program)(new RNG("hello"));

          const vertPosition = gl.getAttribLocation(program, "vertPosition");
          const [quadVertices, quadIndices] =
            createQuad(gl)(program)(vertPosition);
          const cancelAnimation = Window.animate(() => {
            uniform2f(gl)(program)("u_resolution", canvas.width, canvas.height);
            // console.log(canvas.width, canvas.height);
            // Enable the attribute
            gl.bindBuffer(gl.ARRAY_BUFFER, quadVertices);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadIndices);
            gl.enableVertexAttribArray(vertPosition);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
          });

          return () => {
            cancelAnimation();
            gl.useProgram(null);
            gl.deleteProgram(program);
            gl.deleteBuffer(quadVertices);
            gl.deleteBuffer(quadIndices);
          };
        } else {
          console.error("You don't have webgl2 context... alert user!");
        }
      }
    };

    exec();
  }, []);

  return <AdaptiveCanvas ref={canvasRef} />;
}

const setUniforms =
  (gl: WebGL2RenderingContext) =>
  (program: WebGLProgram) =>
  (random: RNG): void => {
    const u1f = uniform1f(gl)(program);
    const u2f = uniform2f(gl)(program);
    const u3f = uniform3f(gl)(program);
    u1f("u_numOctaves", random.uniform(8, 16));
    u1f("u_zoom", random.uniform(0.4, 1.6));
    u3f(
      "u_cc",
      random.uniform(10, 20),
      random.uniform(10, 20),
      random.uniform(10, 20)
    );
    u3f("u_dd", random.random(), random.random(), random.random());
    u2f("u_q_h", random.uniform(0.7, 1.3), random.uniform(0.7, 1.3));
    u2f("u_r_h", random.uniform(0.7, 1.3), random.uniform(0.7, 1.3));
    u1f("u_pattern_h", random.uniform(0.8, 1.2));
    u2f("u_center_point", random.random(), random.random());
    u1f("u_pixel_distance_choice", random.random());
    u1f("u_interpolation_choice", random.uniform(0.0, 3.0));
    u2f("u_q_fbm_displace_1", random.uniform(0, 20), random.uniform(0, 20));
    u2f("u_q_fbm_displace_2", random.uniform(0, 20), random.uniform(0, 20));
    u2f("u_r_fbm_displace_1", random.uniform(0, 20), random.uniform(0, 20));
    u2f("u_r_fbm_displace_2", random.uniform(0, 20), random.uniform(0, 20));
    u1f("u_color_speed", random.uniform(0.5, 1.0));
  };

// TODO: gl.deleteBuffer(buffer);
// + how do we
const createQuad =
  (gl: WebGL2RenderingContext) =>
  (program: WebGLProgram) =>
  (index: number): [WebGLBuffer | null, WebGLBuffer | null] => {
    // Drawing a quad
    let vertices = [
      -1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0,
    ];
    const indices = [3, 2, 1, 3, 1, 0];

    let triangleVertexBufferObj = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObj);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); // Uses the last bound buffer

    // Create an empty buffer object to store Index buffer
    var Index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );

    // Now we need to inform the vertex shader about the quad we just made.

    // 3 <- the number of points in each vertex
    // float <- because they are floating point numbers
    // false <- whether or not to normalize data into a certain range, we will skip that
    // stride <- if zero assumed to be thightly packed (3 * Float32Array.BYTES_PER_ELEMENT)
    // offset <- offset in butes to the first component in the vertez attribute array
    gl.vertexAttribPointer(
      index,
      3,
      gl.FLOAT,
      false,
      3 * Float32Array.BYTES_PER_ELEMENT,
      0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return [triangleVertexBufferObj, Index_Buffer];
  };
