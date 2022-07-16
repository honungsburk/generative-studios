#version 300 es
  
// our vertex data
in vec3 vertPosition;

void main() {

  // send the vertex information on to the fragment shader
  gl_Position = vec4(vertPosition, 1.0); //positionVec4;
}