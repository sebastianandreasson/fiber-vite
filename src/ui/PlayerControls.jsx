import { useAtom } from 'jotai'
import React from 'react'
import styled from 'styled-components'
import { playerAtom } from '../state'

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

const PlayerControls = () => {
  const [player, setPlayer] = useAtom(playerAtom)

  const onMove = (key, value) => {
    setPlayer((p) => ({
      ...p,
      position: {
        ...p.position,
        [key]: value,
      },
    }))
  }

  return (
    <Container>
      <h2>Player</h2>

      <button onClick={() => onMove('x', player.position.x + 1)}>
        Move X: {player.position.x}
      </button>
      <button onClick={() => onMove('y', player.position.y + 1)}>
        Move Y: {player.position.y}
      </button>
    </Container>
  )
}

export default PlayerControls
