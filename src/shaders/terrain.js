import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'

const vert = glsl`
varying vec2 vUv;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
}`

const frag = glsl`
uniform vec3 color;
varying vec2 vUv;

void main() {
  gl_FragColor.rgba = vec4(color, 1.0);
}
`

export const TerrainMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.2, 0.0, 0.1),
  },
  vert,
  frag
)

extend({ TerrainMaterial })
