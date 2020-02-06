import { Index , CellTypes, ReturnPath } from '../util'
import Cell from './Cell'

class Grid {
  size: Index
  mapgen: CellTypes[][]
  wormholeOuts: {cell: Cell, index: Index}[]
  data: Cell[][]
  end_cell: Cell | null
  head_index: Index


  constructor (mapgen:CellTypes[][], size: Index) {
    this.size = size
    this.mapgen = mapgen
    this.wormholeOuts = []
    this.head_index = [-1, -1]
    this.data = mapgen.map((row, x) => {
      return row.map((type, y) => {
        const cell = new Cell([x, y], type)
        if(type === CellTypes.OutWormhole)
          this.wormholeOuts.push({ cell, index: [x,y] })
        if (type === CellTypes.Start)
          this.head_index = [x, y]
        return cell
      })
    })
    this.end_cell = null
    this.hasHead() && this.getHead().setTotalDistance(0)
    return this
  }

  hasHead() {
    return this.head_index[0] !== -1 && this.head_index[1] !== -1
  }

  getHead() {
    return this.hasHead() ? this.data[this.head_index[0]][this.head_index[1]] : new Cell([-5, -5], CellTypes.Clear)
  }

  getNeighbours (index: Index) {
    const neighbours: { neighbour: Cell, neighbour_distance: number, neighbour_index: Index }[] = []
    const cell = this.data[index[0]][index[1]]
    if (cell.type === CellTypes.InWormhole) {
      // all the wormhole outs are neighnours to wormhole in
      this.wormholeOuts.map(w_out => {
        const neighbour_distance = this.getDistance(cell.type, CellTypes.OutWormhole)
        neighbours.push({ neighbour: w_out.cell, neighbour_distance, neighbour_index: w_out.index })
        return null
      })
    }

    // 4 directions
    // can write the directions better
    ;[[-1,0], [1,0], [0,-1], [0,1]].map(dir => {
      let nextIndex = [index[0] + dir[0], index[1] + dir[1]]
      let x = nextIndex[0], y = nextIndex[1]
      if (x < 0 || y < 0) // out of bounds
        return null
      if (x >= this.size[0] || y >= this.size[1])
        return null
      const neighbour = this.data[x][y]
      if (neighbour.type === CellTypes.Boulder) // boulders are disconnected
        return null
      const neighbour_distance = this.getDistance(cell.type, neighbour.type)
      neighbours.push({ neighbour, neighbour_distance, neighbour_index: [x, y] })
      return null
    })

    return neighbours
  }

  getDistance (fromCell: CellTypes, toCell: CellTypes): number {
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
    // === Could use a hash approach if needed more control

    // [C]lean cell
    // [G]ravel
    // [I]n wormhole
    // [O]ut wormhole
    // [B]oulder
    // also [S]tart & [E]xit
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
    if (!this.hasHead()) {
      return { distance: -1 , path: [] }
    }
    const cell_queue: Cell[] = [this.getHead()]
    const cell_index_queue: Index[] = [this.head_index]

    while (cell_queue.length && cell_index_queue.length) {
      const next_cell: Cell | undefined = cell_queue.shift()
      const next_index: Index | undefined = cell_index_queue.shift()

      if(next_cell && next_index){
        next_cell.visited = true

        this.getNeighbours(next_index).map(({ neighbour, neighbour_distance, neighbour_index }) => {
          if(!cell_queue.includes(neighbour) && !neighbour.visited) {
            cell_queue.push(neighbour)
            cell_index_queue.push(neighbour_index)
          }
          const new_neighbour_distance = next_cell.total_distance + neighbour_distance
          if (new_neighbour_distance < neighbour.total_distance) {
            neighbour.setTotalDistance(new_neighbour_distance)
            neighbour.previous = next_cell
            if (neighbour.type === CellTypes.End)
              this.end_cell = neighbour
          }
          return null
        })
      }
    }

    if (this.end_cell) {
      // console.log('shortest path:')
      // recursively traverse 'previous' to find the path
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

export default Grid