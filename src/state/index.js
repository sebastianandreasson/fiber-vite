import { atom } from 'jotai'

export const noiseSettingsAtom = atom({
  seed: 1,
  octaves: 4,
  scale: 2,
  persistence: 1.5,
  lacunarity: 0.25,
  floor: -10,
})
