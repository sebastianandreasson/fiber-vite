import SimplexNoise from 'simplex-noise'

export const chunkForOffset = (heightMap, chunkSize, xOff, yOff) => {
  const map = []
  const xOffAmount = xOff * chunkSize
  const yOffAmount = yOff * chunkSize
  for (let y = 0; y < chunkSize; y++) {
    map.push([])
    for (let x = 0; x < chunkSize; x++) {
      map[y][x] = heightMap[y + yOffAmount][x + xOffAmount]
    }
  }
  return map
}

const inverseLerp = (x, a, b) => (x - a) / (b - a)

const maxPossibleHeight = (octaves, persistence) => {
  let max = 0
  let amplitude = 1
  for (let i = 0; i < octaves; i++) {
    max += amplitude
    amplitude *= persistence
  }
  return max
}

export const createHeightMap = (size, settings, xOffset, yOffset) => {
  let half = size / 2
  const simplex = new SimplexNoise(settings.seed)
  let map = []

  const maxHeight = maxPossibleHeight(settings.octaves, settings.persistence)
  let minValue = Number.MAX_VALUE
  let maxValue = -Number.MAX_VALUE
  const octaveOffsets = []

  for (let i = 0; i < settings.octaves; i++) {
    octaveOffsets.push({
      x: simplex.noise2D(i * 10, i * 10),
      y: simplex.noise2D((i + 1) * 20, (i + 1) * 20),
    })
  }

  for (let y = 0; y < size; y++) {
    map.push([])
    for (let x = 0; x < size; x++) {
      let amplitude = 1
      let frequency = 1
      let value = 0

      for (let i = 0; i < settings.octaves; i++) {
        let sampleX =
          ((x - half + octaveOffsets[i].x + xOffset * size) / settings.scale) *
          frequency
        let sampleY =
          ((y - half + octaveOffsets[i].y + yOffset * size) / settings.scale) *
          frequency

        let noiseValue = simplex.noise2D(sampleX, sampleY) * 2 - 1

        value += noiseValue * amplitude

        amplitude *= settings.persistence
        frequency *= settings.lacunarity
      }

      if (maxValue < value) {
        maxValue = value
      }
      if (minValue > value) {
        minValue = value
      }

      map[y][x] = value
      // const normalizedValue = value + 1 / (2 * maxHeight)
      // map[y][x] = normalizedValue * settings.heightMultiplier
    }
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      map[y][x] =
        inverseLerp(map[y][x], minValue, maxValue) * settings.heightMultiplier
    }
  }

  return map
}
