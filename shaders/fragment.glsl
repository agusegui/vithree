uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uTime;
uniform float uProgress;
uniform float uSpeed;
uniform vec2 uMouse;
uniform vec4 uResolution;


varying vec2 vUv;
varying vec3 vPos;

float PI = 3.141592653589793238;

void main() {
    gl_FragColor = vec4(vUv, 1., 1.);
}