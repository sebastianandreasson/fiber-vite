import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { Vector2 } from 'three'
import glsl from 'babel-plugin-glsl/macro'
import noise from './noise'

const updatedVert = glsl`
varying float vWorldZ;
varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec3 viewZ;
uniform float u_time;
uniform float u_repeat;

void main() {
  vec4 worldPosition = modelMatrix *  vec4(position, 1.);
  vec4 viewPosition = viewMatrix * worldPosition;

  float time = u_time * 0.1;
  vUv = uv;
  vec3 newPos = position.xyz;
  newPos.z += 0.08*sin(time/1.8 + u_repeat * uv.y) + 0.08 * cos(time/2.0 + u_repeat*uv.x);
  viewZ = -(modelViewMatrix * vec4(newPos, 1.)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);

  vViewPosition = viewPosition.xyz;
  vWorldPosition = worldPosition.xyz;
  vWorldZ = viewPosition.z;
}
`

const vert = glsl`
varying float vWorldZ;
varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

void main() {
    vec4 worldPosition = modelMatrix *  vec4(position, 1.);
    vec4 viewPosition = viewMatrix * worldPosition;

    vUv = uv;

    vViewPosition = viewPosition.xyz;
    vWorldPosition = worldPosition.xyz;
  
    gl_Position = projectionMatrix  * viewPosition;
    vWorldZ = viewPosition.z;
}
`

const frag = glsl`
#include <packing>
  
uniform sampler2D u_depth;
uniform vec2 u_resolution;
uniform sampler2D u_map;
uniform sampler2D u_texture;
uniform float u_time;

uniform vec3 u_shallow_color;
uniform vec3 u_deep_color;
uniform vec3 u_foam_color;

uniform float u_shallow_opacity;
uniform float u_deep_opacity;
uniform float u_foam_opacity;

uniform float u_factor;
uniform float u_repeat;

uniform float cameraNear;
uniform float cameraFar;

uniform vec2 u_range;
uniform sampler2D u_ramp;

uniform float u_noise_scale;
uniform float u_noise_step;

varying vec2 vUv;
varying float vWorldZ;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

float readDepth( sampler2D depthSampler, vec2 coord ) {
  float fragCoordZ = texture2D( depthSampler, coord ).x;
  float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
  return viewZ;
}

${noise}

void main() {
  float time = u_time * 0.1;
  float distanceDark = 8.0;
  float distanceLight = 12.0;
  float max_depth = 3.0;

  vec2  sUv = gl_FragCoord.xy / u_resolution;

  float depth = readDepth( u_depth, sUv);

  float sceneDepth = vWorldZ - depth;
  float scaledDepth = sceneDepth/u_factor;

  scaledDepth = clamp(scaledDepth, 0., 1.);
  
  if (true) {
    // noise calcs
    float noise = snoise(vUv * 30. + (u_time * 0.5));
    float invertedSceneDepth = 1. - clamp(sceneDepth * 0.8, 0., 1.);

    float foamDepth = invertedSceneDepth;
    foamDepth *= 1.1;
    vec3 foam = vec3(
      step(
        0.5, 
        clamp(
          foamDepth + (noise * u_noise_scale * 0.001), 
          0., 
          1.
        )
      )
    );
    float transition = smoothstep(0.2 , 0.3, sceneDepth - foamDepth);

    vec4 darkFoam = 1.0 - 0.2*smoothstep(distanceDark, 0.0,foamDepth)*texture2D(u_texture, vUv * u_repeat*1.25);
      vec4 lightFoam = vec4(u_foam_color,1.0) * texture2D(u_texture, vUv *
        (1.0/u_repeat) + (u_repeat/30.0) * vec2(sin(time*2.0+u_repeat*vUv.x), cos(time*2.0+u_repeat*2.5*vUv.y)) +
        (2.0/u_repeat) * vec2(sin(u_repeat*5.0*vUv.x), cos(u_repeat*5.0*vUv.y))
      ) * 0.5 * smoothstep(distanceLight, 0.0, foamDepth);

    gl_FragColor.rgb = vec3(foam);

    vec4 depthColor = texture2D(u_ramp, vec2(1. - scaledDepth, 0.5));
    gl_FragColor.rgb = depthColor.rgb;

    vec4 color = texture2D(u_texture, vUv * 1.25);
    gl_FragColor.rgba = darkFoam;

    gl_FragColor = mix(vec4(u_foam_color,u_foam_opacity), depthColor * darkFoam + lightFoam, transition);
  }
  

  gl_FragColor.a = clamp(sceneDepth + 0.9, 0., 1.);
}
`

export const DepthFadeMaterial = shaderMaterial(
  {
    u_depth: null,
    u_texture: null,
    u_resolution: new Vector2(0, 0),
    u_map: null,
    u_range: new Vector2(0, 1),
    u_time: 0,
    u_factor: 30,
    u_repeat: 10,
    u_ramp: null,
    u_noise_scale: 10,
    u_noise_step: 10,
    u_foam_color: new THREE.Color('#FFFFFF'),
    u_shallow_color: new THREE.Color('#65DBF2'),
    u_deep_color: new THREE.Color('#10376E'),
    u_shallow_opacity: 0.2,
    u_deep_opacity: 1.0,
    u_foam_opacity: 0.6,
    cameraNear: 0,
    cameraFar: 1,
  },
  updatedVert,
  frag
)

extend({ DepthFadeMaterial })
