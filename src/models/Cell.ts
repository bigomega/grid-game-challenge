import { Index , CellTypes } from '../util'

class Cell {
  index: Index
  type: CellTypes
  total_distance: number
  adjacent_cells: { neighbour: Cell, neighbour_distance: number }[]
  previous: Cell | null

  constructor(index: [number, number], type: CellTypes, total_distance = Infinity) {
    this.index = index
    this.type = type
    this.total_distance = total_distance
    this.adjacent_cells = []
    this.previous = null // for tracing the final path
    return this
  }
}

export default Cell