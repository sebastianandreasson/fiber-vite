import { useAtom } from 'jotai'
import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { playerAtom, TERRAIN_CHUNK_SIZE } from '../state'

const Player = () => {
  const ref = useRef()
  const [player] = useAtom(playerAtom)

  useFrame(() => {
    ref.current.rotation.x += 0.001
    ref.current.rotation.y += 0.001
  })

  return (
    <mesh
      ref={ref}
      castShadow
      receiveShadow
      position={[
        player.position.x * TERRAIN_CHUNK_SIZE,
        3,
        player.position.y * TERRAIN_CHUNK_SIZE,
      ]}
      scale={1}
    >
      <boxBufferGeometry />
      <meshStandardMaterial attach="material" color="red" />
    </mesh>
  )
}

export default Player
