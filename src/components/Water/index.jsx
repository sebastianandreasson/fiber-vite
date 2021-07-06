import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFBO, useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'

import rampTextureUrl from './ramp.png'
import { generateCausticCanvasTexture } from './utils'

const u_factor = 2.5
const u_noise_scale = 340
const u_noise_step = 10

const Water = () => {
  const dfMaterial = useRef()
  const [dpr, size] = useThree(({ viewport, size }) => [viewport.dpr, size])
  const camera = useThree((state) => state.camera)
  const u_ramp = useTexture(rampTextureUrl)
  const voronoiTexture = useMemo(() => {
    return generateCausticCanvasTexture(10)
  })

  const depthFBO = useFBO(size.width * dpr, size.height * dpr, {
    encoding: THREE.sRGBEncoding,
  })

  useEffect(() => {
    if (depthFBO) {
      depthFBO.depthBuffer = true
      depthFBO.depthTexture = new THREE.DepthTexture()
      depthFBO.depthTexture.format = THREE.DepthFormat
      depthFBO.depthTexture.type = THREE.UnsignedShortType
    }
  }, [depthFBO])

  const [group, setGroup] = useState()

  useFrame(({ gl, scene, camera }) => {
    gl.setRenderTarget(depthFBO)
    gl.render(scene, camera)
  }, -2)

  useFrame(({ clock }) => {
    if (dfMaterial.current) {
      dfMaterial.current.uniforms.u_time.value = clock.getElapsedTime()
      dfMaterial.current.uniforms.u_resolution.value.set(
        size.width * dpr,
        size.height * dpr
      )
    }
  })

  useFrame(({ clock }) => {
    const t = Math.sin(clock.getElapsedTime())
    group.position.y = -9 + t / 25
    group.scale.setScalar(0.95 + t * t * 0.05)
  })

  return (
    <group ref={setGroup}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 12, 0]}>
        <planeGeometry args={[75, 75]} />
        <depthFadeMaterial
          ref={dfMaterial}
          cameraNear={camera.near}
          cameraFar={camera.far}
          transparent
          depthWrite={false}
          u_texture={voronoiTexture}
          u_depth={depthFBO?.depthTexture}
          u_factor={u_factor}
          u_noise_scale={u_noise_scale}
          u_noise_step={u_noise_step}
          u_ramp={u_ramp}
        />
      </mesh>
    </group>
  )
}

export default Water
