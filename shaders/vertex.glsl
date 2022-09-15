uniform float uTime;
uniform float uProgress;
uniform float uDirection;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vPos;

float PI = 3.141592653589793238;

void main() {

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vUv = uv;
    vPos = position;
    
}