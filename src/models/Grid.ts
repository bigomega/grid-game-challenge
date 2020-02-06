import { Index , CellTypes, ReturnPath } from '../util'
import Cell from './Cell'

class Grid {
  size: Index
  mapgen: CellTypes[][]
  wormholeOuts: Cell[]
  flat_data: Cell[]
  data: Cell[][]
  end_cell: Cell | null
  head_cell: Cell


  constructor (mapgen:CellTypes[][], size: Index) {
    this.size = size
    this.mapgen = mapgen
    this.wormholeOuts = []
    this.flat_data = [] // .flat() is still experimental
    this.head_cell = new Cell([0, 0], CellTypes.Start)
    this.data = mapgen.map((row, x) => {
      return row.map((type, y) => {
        const cell = new Cell([x, y], type, Infinity)
        this.flat_data.push(cell)
        if(type === CellTypes.OutWormhole)
          this.wormholeOuts.push(cell)
        if (type === CellTypes.Start)
          this.head_cell = cell
        return cell
      })
    })
    this.end_cell = null
    this.head_cell.total_distance = 0
    return this
  }

  getNeighbours (index: Index) {
    const neighbours: { neighbour: Cell, neighbour_distance: number }[] = []
    const cell = this.data[index[0]][index[1]]
    if (cell.type === CellTypes.InWormhole) {
      // all the wormhole outs are neighnours to wormhole in
      this.wormholeOuts.map(neighbour => {
        const neighbour_distance = this.getDistance(cell.type, CellTypes.OutWormhole)
        neighbours.push({ neighbour, neighbour_distance })
        return null
      })
    }

    // 4 directions
    // can write the directions better
    ;[[-1,0], [1,0], [0,-1], [0,1]].map(dir => {
      let nextIndex = [index[0] + dir[0], index[1] + dir[1]]
      let x = nextIndex[0], y = nextIndex[1] // out of bounds
      if (x < 0 || y < 0)
        return null
      if (x >= this.size[0] || y >= this.size[1])
        return null
      const neighbour = this.data[x][y]
      if (neighbour.type === CellTypes.Boulder) // boulders are disconnected
        return null
      const neighbour_distance = this.getDistance(cell.type, neighbour.type)
      neighbours.push({ neighbour, neighbour_distance })
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
    let cell_queue = [this.flat_data.reduce(
      (mem, cell) => cell.total_distance > mem.total_distance ? mem : cell
    )]
    if (cell_queue[0] && cell_queue[0].total_distance !== 0) {
      // head MUST be at 0, this means no head
      return { distance: -1 , path: [] }
    }

    while (cell_queue.length) {
      const next_cell = cell_queue.shift()

      if(next_cell){
        next_cell.visited = true

        this.getNeighbours(next_cell.index).map(({ neighbour, neighbour_distance }) => {
          if(!cell_queue.includes(neighbour) && !neighbour.visited) {
            cell_queue.push(neighbour)
          }
          const new_neighbour_distance = next_cell.total_distance + neighbour_distance
          if (new_neighbour_distance < neighbour.total_distance) {
            neighbour.total_distance = new_neighbour_distance
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