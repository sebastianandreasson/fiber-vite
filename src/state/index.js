import { atom } from 'jotai'

export const LOD_LEVELS = []
export const TERRAIN_CHUNK_SIZE = 75

export const noiseSettingsAtom = atom({
  xOff: 0,
  yOff: 0,
  seed: 1,
  octaves: 4,
  scale: 80,
  persistence: 0.5,
  lacunarity: 2.5,
  heightMultiplier: 25,
  floor: -10,
  // LOD:
})

export const terrainChunksAtom = atom({})

export const playerAtom = atom({
  position: {
    x: 0,
    y: 0,
  },
})
