import React from 'react'
import useTerrainGenerator from '../hooks/useTerrainGenerator'
import Terrain from './Terrain'

const World = () => {
  const terrainChunks = useTerrainGenerator()

  return (
    <>
      {Object.keys(terrainChunks).map((key) => (
        <Terrain {...terrainChunks[key]} key={`Terrain_${key}`} />
      ))}
    </>
  )
}

export default World
