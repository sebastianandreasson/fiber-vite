export const gridPositionsForCenter = ({ x, y }) => [
  {
    x: x - 1,
    y: y - 1,
  },
  {
    x,
    y: y - 1,
  },
  {
    x: x + 1,
    y: y - 1,
  },
  {
    x: x - 1,
    y,
  },
  {
    x,
    y,
  },
  {
    x: x + 1,
    y,
  },
  {
    x: x - 1,
    y: y + 1,
  },
  {
    x,
    y: y + 1,
  },
  {
    x: x + 1,
    y: y + 1,
  },
]
