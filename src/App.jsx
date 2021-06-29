import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, softShadows, Stats } from '@react-three/drei'
import { EffectComposer, Pixelation } from '@react-three/postprocessing'

import NoiseControls from './ui/NoiseControls'
import World from './components/World'
import Player from './components/Player'
import Water from './components/Water'
import PlayerControls from './ui/PlayerControls'

// softShadows()

export default function App() {
  return (
    <>
      <div id="canvas">
        <Canvas
          shadows
          camera={{ position: [30, 30, 30], near: 1, far: 1000 }}
          dpr={[1, 2]}
        >
          <Sky azimuth={1} inclination={0.6} distance={100} />
          {/* <fog attach="fog" args={['lightblue', 16, 70]} /> */}
          <OrbitControls />
          <ambientLight intensity={1} />
          {/* <directionalLight
            intensity={1}
            castShadow
            shadow-mapSize-height={512}
            shadow-mapSize-width={512}
          /> */}
          <pointLight
            castShadow
            position={[2, 10, 2]}
            color="#eee5b5"
            intensity={4}
          />
          <World />
          <Player />
          <Suspense fallback={null}>{/* <Water /> */}</Suspense>
          <EffectComposer>
            {/* <Pixelation granularity={8} /> */}
          </EffectComposer>
          <Stats showPanel={0} className="stats" />
        </Canvas>
      </div>
      <div id="ui">
        <NoiseControls />
        {/* <PlayerControls /> */}
      </div>
    </>
  )
}
