import { useEffect, useRef } from "react";
import AdaptiveCanvas from "src/Components/AdaptiveCanvas";
import * as Random from "src/Libraries/Random";
import { uniform1f, uniform2f } from "src/Libraries/WebGL/uniform";
import * as WebGL from "src/Libraries/WebGL";
import vertexShaderPath from "./Shaders/shader.vert?url";
import fragShaderPath from "./Shaders/shader.frag?url";
import * as Window from "src/Util/Window";
import GenerativeStudio from "src/Components/GenerativeStudio";
import * as Settings from "./Settings";
import { useStoreInUrl } from "src/Hooks/useStoreInUrl";
import * as Canvas from "src/Libraries/Canvas";
import AboutTab from "./AboutTab";
import TuneTab from "./TuneTab";

const randomSetting = () => Settings.random(new Random.RNG(Random.genSeed(8)));

export default function AlgoMarble() {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const [settings, setSettings] = useStoreInUrl(
    Settings.URL.encode,
    Settings.URL.decode,
    randomSetting
  );

  // Drawing
  useEffect(() => {
    let cancelAnimation = () => {};
    let ss: Setup | undefined = undefined;

    const exec = async () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ss = await setup(canvas);

        let lastHeight = 0;
        let lastWidth = 0;
        let lastScale = 1.0;
        const time = new Date();
        // time.getMilliseconds()

        cancelAnimation = Window.animate(() => {
          // Chaning the viewport is super expensive!
          if (
            lastHeight !== canvas.height ||
            lastWidth !== canvas.width ||
            window.devicePixelRatio !== lastScale
          ) {
            lastHeight = canvas.height;
            lastWidth = canvas.width;
            lastScale = window.devicePixelRatio;
            render(
              ss,
              settings,
              canvas.width,
              canvas.height,
              1000 // 1 second
            );
          }
        });

        console.log("Create");
      } else {
        console.error("You don't have webgl2 context... alert user!");
      }
    };

    exec();
    return () => {
      console.log("Destroy");
      cancelAnimation();
      ss && clean(ss);
    };
  }, [settings]);

  return (
    <GenerativeStudio
      onGenerateRandomClick={() => {
        setSettings(randomSetting());
      }}
      onDownload={(width, height, name, format) => {
        Canvas.save(width, height, name, format, async (canvas) => {
          const ss = await setup(canvas);
          render(ss, settings, width, height, 1000); // one second
          clean(ss);
        });
      }}
      name={"AlgoMarble"}
      tuneTab={<TuneTab settings={settings} setSettings={setSettings} />}
      aboutTab={<AboutTab />}
    >
      <AdaptiveCanvas ref={canvasRef} />
    </GenerativeStudio>
  );
}

const createQuad =
  (gl: WebGL2RenderingContext) =>
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

type Setup = {
  quadVertices: WebGLBuffer;
  quadIndices: WebGLBuffer;
  vertPosition: number;
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
};

async function setup(canvas: HTMLCanvasElement): Promise<Setup> {
  const gl = canvas.getContext("webgl2");
  if (gl) {
    const vert = await WebGL.loadShader(gl)(gl.VERTEX_SHADER, vertexShaderPath);
    const frag = await WebGL.loadShader(gl)(gl.FRAGMENT_SHADER, fragShaderPath);
    const program = WebGL.createProgram(gl)(vert, frag);
    gl.useProgram(program);

    const vertPosition = gl.getAttribLocation(program, "vertPosition");
    const [quadVertices, quadIndices] = createQuad(gl)(vertPosition);
    if (quadVertices && quadIndices) {
      return {
        quadVertices: quadVertices,
        quadIndices: quadIndices,
        vertPosition: vertPosition,
        gl: gl,
        program: program,
      };
    }
  }

  throw Error("Could not setup AlgoMarble");
}

function render(
  setup: Setup,
  settings: Settings.Settings,
  width: number,
  height: number,
  time: number
): void {
  const scale = window.devicePixelRatio;
  const { quadVertices, quadIndices, vertPosition, gl, program } = setup;
  gl.viewport(0, 0, width, height);
  gl.useProgram(program);
  Settings.setUniforms(gl)(program)(settings);
  uniform1f(gl)(program)("u_time", time);
  uniform2f(gl)(program)("u_resolution", width, height);
  gl.bindBuffer(gl.ARRAY_BUFFER, quadVertices);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadIndices);
  gl.enableVertexAttribArray(vertPosition);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  // console.log("render", width, height);
  // console.log(settings);
}

function clean(setup: Setup): void {
  setup.gl.useProgram(null);
  setup.gl.deleteProgram(setup.program);
  setup.gl.deleteBuffer(setup.quadVertices);
  setup.gl.deleteBuffer(setup.quadIndices);
}
