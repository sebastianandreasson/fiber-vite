import React, { useEffect, useRef } from 'react'
import { TERRAIN_CHUNK_SIZE } from '../state'

const Terrain = ({ heightMap, position }) => {
  const mesh = useRef()

  useEffect(() => {
    if (!mesh.current) return
    const { geometry } = mesh.current

    let pos = geometry.getAttribute('position')
    let pa = pos.array
    const hVerts = geometry.parameters.heightSegments + 1
    const wVerts = geometry.parameters.widthSegments + 1
    for (let y = 0; y < hVerts; y++) {
      for (let x = 0; x < wVerts; x++) {
        pa[3 * (y * wVerts + x) + 2] = heightMap[y][x]
      }
    }

    pos.needsUpdate = true
    geometry.computeVertexNormals()
  }, [mesh])

  return (
    <mesh
      ref={mesh}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      castShadow
      position={[
        position.x * TERRAIN_CHUNK_SIZE,
        -10,
        position.y * TERRAIN_CHUNK_SIZE,
      ]}
    >
      <planeBufferGeometry
        attach="geometry"
        args={[
          TERRAIN_CHUNK_SIZE,
          TERRAIN_CHUNK_SIZE,
          TERRAIN_CHUNK_SIZE - 1,
          TERRAIN_CHUNK_SIZE - 1,
        ]}
      />
      {/* <terrainMaterial /> */}
      <meshStandardMaterial
        // wireframe
        attach="material"
        // color="brown
        // color="lime"
        color="#585858"
        shininess={0}
        roughness={1}
        // flatShading
      />
    </mesh>
  )
}

export default Terrain
