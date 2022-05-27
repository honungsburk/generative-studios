import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";

let x = 50;
const y = 50;

export default function StainedGlass() {
  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(500, 500).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    p5.background(255, 130, 20);
    p5.ellipse(100, 100, 100);
    p5.ellipse(300, 100, 100);
  };

  return <Sketch setup={setup} draw={draw} />;
}
