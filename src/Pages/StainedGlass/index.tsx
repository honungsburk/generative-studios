import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import * as Algorithm from "./Algorithm";

export default function StainedGlass() {
  //See annotations in JS for more information

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return (
    <Sketch
      setup={Algorithm.setup}
      draw={Algorithm.draw}
      windowResized={windowResized}
    />
  );
}
