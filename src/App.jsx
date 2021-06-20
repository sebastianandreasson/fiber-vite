import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sky, softShadows, Stats } from '@react-three/drei'
import Terrain from './Terrain'
import { EffectComposer } from '@react-three/postprocessing'
import NoiseControls from './ui/NoiseControls'

softShadows()

const Box = ({ passedRef }) => {
  useFrame(() => {
    passedRef.current.rotation.x += 0.001
    passedRef.current.rotation.y += 0.001
  })

  return (
    <mesh
      ref={passedRef}
      castShadow
      receiveShadow
      position={[0, 1.5, 0]}
      scale={1}
    >
      <boxBufferGeometry />
      <meshStandardMaterial attach="material" color="orange" />
    </mesh>
  )
}

const Plane = () => {
  return (
    <mesh
      receiveShadow
      castShadow
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[300, 300, 0.2]}
    >
      <planeBufferGeometry />
      <meshStandardMaterial color="gray" />
    </mesh>
  )
}

export default function App() {
  const boxRef = useRef()

  return (
    <>
      <div id="canvas">
        <Canvas shadows camera={{ position: [3, 3, 3] }}>
          <Sky azimuth={1} inclination={0.6} distance={1000} />
          <OrbitControls />
          <ambientLight intensity={1} />
          <directionalLight
            intensity={1}
            castShadow
            shadow-mapSize-height={512}
            shadow-mapSize-width={512}
          />
          <pointLight
            castShadow
            position={[2, 1, 2]}
            color="red"
            intensity={4}
          />
          <Box passedRef={boxRef} />
          <Terrain />
          <EffectComposer>
            {/* <Pixelation granularity={2} /> */}
          </EffectComposer>
          <Stats showPanel={0} className="stats" />
        </Canvas>
      </div>
      <div id="ui">
        <NoiseControls />
      </div>
    </>
  )
}
