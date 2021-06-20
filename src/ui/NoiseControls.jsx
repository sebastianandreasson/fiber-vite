import { useAtom } from 'jotai'
import React from 'react'
import styled from 'styled-components'
import { noiseSettingsAtom } from '../state'

const Container = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;

  width: 150px;
  height: 400px;
  z-index: 2;

  display: flex;
  flex-direction: column;
`

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Slider = (props) => {
  return (
    <SliderContainer>
      <span>{props.name}</span>
      <input
        type="range"
        {...props}
        onChange={(e) => props.onChange(props.name, e.target.value)}
      ></input>
    </SliderContainer>
  )
}

const NoiseControls = () => {
  const [noiseSettings, setNoiseSettings] = useAtom(noiseSettingsAtom)

  const onChange = (key, value) => {
    setNoiseSettings((settings) => ({
      ...settings,
      [key]: value,
    }))
  }

  return (
    <Container>
      <h2>Controls</h2>

      <Slider
        name="octaves"
        value={noiseSettings.octaves}
        min={1}
        max={10}
        step={1}
        onChange={onChange}
      />
      <Slider
        name="scale"
        value={noiseSettings.scale}
        min={0}
        max={5}
        step={0.1}
        onChange={onChange}
      />
      <Slider
        name="persistence"
        value={noiseSettings.persistence}
        min={0}
        step={0.1}
        max={5}
        onChange={onChange}
      />
      <Slider
        name="lacunarity"
        value={noiseSettings.lacunarity}
        min={0}
        step={0.05}
        max={2}
        onChange={onChange}
      />
      <Slider
        name="floor"
        value={noiseSettings.floor}
        min={-20}
        step={0.5}
        max={10}
        onChange={onChange}
      />
    </Container>
  )
}

export default NoiseControls
