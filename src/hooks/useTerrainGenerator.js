import { useEffect } from 'react'
import { useAtom } from 'jotai'
import {
  noiseSettingsAtom,
  playerAtom,
  terrainChunksAtom,
  TERRAIN_CHUNK_SIZE,
} from '../state'
import { chunkForOffset, createHeightMap } from '../utils/heightmap'
import { gridPositionsForCenter } from '../utils/terrain'

const useTerrainGenerator = () => {
  const [player] = useAtom(playerAtom)
  const [noiseSettings] = useAtom(noiseSettingsAtom)
  const [terrainChunks, setTerrainChunks] = useAtom(terrainChunksAtom)

  useEffect(() => {
    setTerrainChunks({})
  }, [noiseSettings, setTerrainChunks])

  useEffect(() => {
    const heightMap = createHeightMap(
      TERRAIN_CHUNK_SIZE * 3,
      noiseSettings,
      -1,
      -1
    )

    const positions = gridPositionsForCenter(player.position)

    let newChunks = {}
    positions.forEach((pos) => {
      const key = `${pos.x}${pos.y}`
      if (!terrainChunks[key]) {
        newChunks[key] = {
          position: pos,
          heightMap: chunkForOffset(
            heightMap,
            TERRAIN_CHUNK_SIZE,
            pos.x + 1,
            pos.y + 1
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
