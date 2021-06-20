import SimplexNoise from 'simplex-noise'

export const createHeightMap = (size, settings) => {
  let half = size / 2
  const simplex = new SimplexNoise(settings.seed)
  let map = []

  for (let y = 0; y < size; y++) {
    map.push([])
    for (let x = 0; x < size; x++) {
      let amplitude = 1
      let frequency = 1
      let value = 0

      for (let i = 0; i < settings.octaves; i++) {
        let sampleX = ((x - half) / settings.scale) * frequency
        let sampleY = ((y - half) / settings.scale) * frequency

        let noiseValue = simplex.noise2D(sampleX, sampleY) * 2 - 1

        value += noiseValue * amplitude

        amplitude *= settings.persistence
        frequency *= settings.lacunarity
      }
      if (value < settings.floor) value = settings.floor
      map[y][x] = value
    }
  }
  return map
}
