import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'

const Box = () => {
  const ref = useRef()

  useFrame(() => {
    ref.current.rotation.x += 0.001
    ref.current.rotation.y += 0.001
  })

  return (
    <mesh ref={ref} castShadow receiveShadow position={[0, 1, 0]}>
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
  return (
    <div id="canvas">
      <Canvas shadows camera={{ position: [3, 3, 3] }}>
        <Sky />
        <OrbitControls />
        <ambientLight intensity={0.2} />
        <directionalLight
          intensity={1}
          castShadow
          shadow-mapSize-height={512}
          shadow-mapSize-width={512}
        />
        <Box />
        <Plane />
      </Canvas>
    </div>
  )
}
