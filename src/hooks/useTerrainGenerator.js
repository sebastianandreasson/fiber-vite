import { useEffect } from 'react'
import { useAtom } from 'jotai'
import {
  noiseSettingsAtom,
  playerAtom,
  terrainChunksAtom,
  TERRAIN_CHUNK_SIZE,
} from '../state'
import { createHeightMap } from '../utils/heightmap'
import { gridPositionsForCenter } from '../utils/terrain'

const useTerrainGenerator = () => {
  const [player] = useAtom(playerAtom)
  const [noiseSettings] = useAtom(noiseSettingsAtom)
  const [terrainChunks, setTerrainChunks] = useAtom(terrainChunksAtom)

  useEffect(() => {
    setTerrainChunks({})
  }, [noiseSettings, setTerrainChunks])

  useEffect(() => {
    console.log('terrainGen useEffect')
    const positions = gridPositionsForCenter(player.position)

    let newChunks = {}
    positions.forEach((pos) => {
      const key = `${pos.x}${pos.y}`
      if (!terrainChunks[key]) {
        newChunks[key] = {
          position: pos,
          heightMap: createHeightMap(
            TERRAIN_CHUNK_SIZE,
            noiseSettings,
            pos.x,
            pos.y
          ),
        }
      }
    })

    setTerrainChunks((t) => ({
      ...t.chunks,
      ...newChunks,
    }))
  }, [player.position, noiseSettings, setTerrainChunks])

  return terrainChunks
}

export default useTerrainGenerator
