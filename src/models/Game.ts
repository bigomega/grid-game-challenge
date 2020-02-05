"use strict"

type Index = [number, number]
enum CellTypes { Boulder, Gravel, InWormhole, OutWormhole, Start, End, Clear }
type ReturnPath = { index: Index, distance: number, cell: CellTypes }[]

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

class Game {
  size: Index
  mapgen: CellTypes[][]
  portalOuts: Cell[]
  flat_grid: Cell[]
  grid: Cell[][]
  end_cell: Cell | null
  head_cell: Cell


  constructor (mapgen:CellTypes[][], size: Index) {
    this.size = size
    this.mapgen = mapgen
    this.portalOuts = []
    this.flat_grid = [] // .flat() is still experimental
    this.head_cell = new Cell([0, 0], CellTypes.Start)
    this.grid = mapgen.map((row, x) => {
      return row.map((type, y) => {
        const cell = new Cell([x, y], type, Infinity)
        this.flat_grid.push(cell)
        if(type === CellTypes.OutWormhole)
          this.portalOuts.push(cell)
        if (type === CellTypes.Start)
          this.head_cell = cell
        return cell
      })
    })
    this.end_cell = null
    this.head_cell.total_distance = 0
    return this
  }

  setAdjacentCells (index: Index) {
    const neighbours = []
    const cell = this.grid[index[0]][index[1]]
    if (cell.type === CellTypes.InWormhole) {
      this.portalOuts.map(neighbour => {
        const neighbour_distance = this.getDistance(cell.type, CellTypes.OutWormhole)
        if (!cell.adjacent_cells.map(n => n.neighbour).includes(neighbour)) {
          cell.adjacent_cells.push({ neighbour, neighbour_distance })
        }
      })
    }

    // can write the directions better TK
    ;[[-1,0], [1,0], [0,-1], [0,1]].map(dir => {
      let nextIndex = [index[0] + dir[0], index[1] + dir[1]]
      let x = nextIndex[0], y = nextIndex[1]
      if (x < 0 || y < 0)
        return
      if (x >= this.size[0] || y >= this.size[1])
        return
      const neighbour = this.grid[x][y]
      if (!(neighbour instanceof Cell))
        // ^ WEIRD, execution shouldn't get here
        return
      if (neighbour.type == CellTypes.Boulder) // boulders are disconnected
        return
      const neighbour_distance = this.getDistance(cell.type, neighbour.type)
      if (!cell.adjacent_cells.map(n => n.neighbour).includes(neighbour)) {
        cell.adjacent_cells.push({ neighbour, neighbour_distance })
      }
    })
  }

  getDistance (fromCell: CellTypes, toCell: CellTypes): number {
    // [C]lean cell
    // [G]ravel
    // [I]n wormhole
    // [O]ut wormhole
    // [B]oulder
    // also [S]tart & [E]xit
    if (fromCell === CellTypes.Boulder || toCell === CellTypes.Boulder)
      return Infinity
    if (fromCell === CellTypes.Gravel || toCell === CellTypes.Gravel) {
      if (fromCell === CellTypes.Gravel && toCell === CellTypes.Gravel) {
        return 4
      } else {
        return 3
      }
    }
    if (fromCell === CellTypes.InWormhole && toCell === CellTypes.OutWormhole) {
      return 0
    }
    return 2
    // fromCell = 'CGIOB'.includes(fromCell) ? fromCell : 'C'
    // toCell = 'CGIOB'.includes(toCell) ? toCell : 'C'
    // return ({
    //   C: { C: 2, G: 3, I: 2, O: 2, B: Infinity, S: 2, E: 2 },
    //   G: { C: 3, G: 4, I: 3, O: 3, B: Infinity, S: 3, E: 3 },
    //   I: { C: 2, G: 3, I: 2, O: 0, B: Infinity, S: 2, E: 2 },
    //   O: { C: 2, G: 3, I: 2, O: 2, B: Infinity, S: 2, E: 2 },
    //   B: { C: Infinity, G: Infinity, I: Infinity, O: Infinity, B: Infinity, S: Infinity, E: Infinity },
    //   S: { C: 2, G: 3, I: 2, O: 2, B: Infinity, S: 2, E: 2 },
    //   E: { C: 2, G: 3, I: 2, O: 2, B: Infinity, S: 2, E: 2 },
    // })[fromCell][toCell]
  }

  findPath (): { distance: number, path: ReturnPath } {
    let cell_queue = this.flat_grid.slice()

    while (cell_queue.length) {
      // go to the closest cell in queue
      let closest_cell = cell_queue.reduce(
        (mem, cell) => cell.total_distance > mem.total_distance ? mem : cell
      )
      cell_queue.splice(cell_queue.indexOf(closest_cell), 1)

      this.setAdjacentCells(closest_cell.index)

      closest_cell.adjacent_cells.map(({ neighbour, neighbour_distance }) => {
        if (cell_queue.includes(neighbour)) {
          const new_total_distance = closest_cell.total_distance + neighbour_distance
          if (new_total_distance < neighbour.total_distance) {
            // refactor: accessing properties outside the class
            neighbour.total_distance = new_total_distance
            neighbour.previous = closest_cell
            if (neighbour.type === CellTypes.End)
              this.end_cell = neighbour
          }
        }
      })
    }

    if (this.end_cell) {
      // console.log('shortest path:')
      // const tt = (cell, fn) => (fn(cell), cell.previous && tt(cell.previous, fn))
      // tt(this.end_cell, cell => console.log(cell.type, cell.index, cell.total_distance))
      const path = (function traverseBack(cell): ReturnPath {
        const current_cell = [{ index: cell.index, distance: cell.total_distance, cell: cell.type }]
        if (!cell.previous) {
          return current_cell
        } else {
          return current_cell.concat(traverseBack(cell.previous))
        }
      })(this.end_cell)
      return {
        distance: this.end_cell.total_distance,
        path,
      }
    } else {
      // console.log('No path')
      return { distance: -1 , path: [] }
    }
  }
}

export default Game