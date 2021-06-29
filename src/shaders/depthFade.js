import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { shaderMaterial, useFBO, useGLTF, useTexture } from '@react-three/drei'
import { Vector2 } from 'three'

import noise from './noise'

export const defaultVertexShader = `
varying vec2 vUv;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
}`

export const DepthSampleMaterial = shaderMaterial(
  {
    u_depth: null,
    cameraNear: 0,
    cameraFar: 1,
  },
  defaultVertexShader,
  `
#include <packing>
  
varying vec2 vUv;
uniform sampler2D u_depth;

uniform float cameraNear;
uniform float cameraFar;

float readDepth( sampler2D depthSampler, vec2 coord ) {
  float fragCoordZ = texture2D( depthSampler, coord ).x;
  float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
  return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
  float depth = readDepth( u_depth, vUv );

  gl_FragColor.rgb = 1.0 - vec3( depth );
  gl_FragColor.a = 1.0;
}
`
)

export const DepthFadeMaterial = shaderMaterial(
  {
    u_depth: null,
    u_resolution: new Vector2(0, 0),
    u_map: null,
    u_range: new Vector2(0, 1),
    u_time: 0,
    u_factor: 30,
    u_ramp: null,
    u_noise_scale: 10,
    u_noise_step: 10,
    u_shallow_color: new THREE.Color('#65DBF2'),
    u_deep_color: new THREE.Color('#10376E'),
    cameraNear: 0,
    cameraFar: 1,
  },
  `
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
`,
  /* glsl */ `
#include <packing>
  
uniform sampler2D u_depth;
uniform vec2 u_resolution;
uniform sampler2D u_map;
uniform float u_time;

uniform vec3 u_shallow_color;
uniform vec3 u_deep_color;

uniform float u_factor;

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

    gl_FragColor.rgb = vec3(foam);

    vec4 depthColor = texture2D(u_ramp, vec2(1. - scaledDepth, 0.5));
    gl_FragColor.rgb = depthColor.rgb;
  }
  

  gl_FragColor.a = clamp(sceneDepth + 0.9, 0., 1.);
}
`
)

extend({ DepthFadeMaterial })
