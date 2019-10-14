#ifdef GL_ES
        precision highp float;
        precision highp int;
#endif

// Uniforms
uniform mat4 worldViewProjection;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vNormal = normal;
  vUv = uv;
  vPosition = position;

  gl_Position = worldViewProjection * vec4(position, 1.0);
}