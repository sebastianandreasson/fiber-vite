import { useAtom } from 'jotai'
import React, { useEffect, useRef } from 'react'
import { useFrame, useUpdate } from 'react-three-fiber'

import SimplexNoise from 'simplex-noise'
import { noiseSettingsAtom } from './state'
import { createHeightMap } from './utils/heightmap'

const Terrain = () => {
  const [noiseSettings] = useAtom(noiseSettingsAtom)
  const mesh = useRef()

  useEffect(() => {
    if (!mesh.current) return
    const { geometry } = mesh.current
    const heightmap = createHeightMap(
      geometry.parameters.widthSegments + 1,
      noiseSettings
    )
    // const simplex = new SimplexNoise(Math.random())

    let pos = geometry.getAttribute('position')
    let pa = pos.array
    const hVerts = geometry.parameters.heightSegments + 1
    const wVerts = geometry.parameters.widthSegments + 1
    for (let j = 0; j < hVerts; j++) {
      for (let i = 0; i < wVerts; i++) {
        const ex = 1.1
        pa[3 * (j * wVerts + i) + 2] = heightmap[j][i]
      }
    }

    pos.needsUpdate = true
  }, [mesh, noiseSettings])

  // Raf loop
  // useFrame(() => {
  //   mesh.current.rotation.z += 0.001
  // })

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
      <planeBufferGeometry attach="geometry" args={[50, 50, 75, 75]} />
      <meshStandardMaterial
        attach="material"
        color="brown"
        shininess={0}
        flatShading
      />
    </mesh>
  )
}

export default Terrain
