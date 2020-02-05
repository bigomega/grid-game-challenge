import { Index , CellTypes } from '../util'

class Cell {
  index: Index
  type: CellTypes
  total_distance: number
  previous: Cell | null
  visited: boolean

  constructor(index: [number, number], type: CellTypes, total_distance = Infinity) {
    this.index = index
    this.type = type
    this.total_distance = total_distance
    this.previous = null // for tracing the final path
    this.visited = false
    return this
  }
}

export default Cell