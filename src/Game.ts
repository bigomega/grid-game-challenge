class Node {
  constructor(index, type, total_distance = Infinity) {
    this.index = index
    this.type = type
    this.total_distance = total_distance
    this.adjacent_nodes = []
    this.previous = null // for tracing the final path
    return this
  }
}

class Game {
  constructor (mapgen = 'SC\nCE', size = [2,2]) {
    this.size = size
    this.mapgen = mapgen
    this.portalOuts = []
    this.flat_grid = [] // .flat() is still experimental
    this.grid = mapgen.split('\n').map((row, x) => {
      let arr = row.split('')
      return arr.map((cell, y) => {
        const node = new Node([x, y], cell, Infinity)
        this.flat_grid.push(node)
        if(cell == 'O')
          this.portalOuts.push(node)
        if (cell == 'S')
          this.head_node = node
        return node
      })
    })
    this.end_node = null
    this.head_node.total_distance = 0
    return this
  }

  setAdjacentNodes (index, callback) {
    const neighbours = []
    const node = this.grid[index[0]][index[1]]
    if (node.type == 'I') {
      this.portalOuts.map(neighbour => {
        const neighbour_distance = this.getDistance(node.type, 'O')
        if (!node.adjacent_nodes.map(n => n.neighbour).includes(neighbour)) {
          node.adjacent_nodes.push({ neighbour, neighbour_distance })
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
      if (!(neighbour instanceof Node))
        // ^ WEIRD, execution shouldn't get here
        return
      if (neighbour.type == 'B') // boulders are disconnected
        return
      const neighbour_distance = this.getDistance(node.type, neighbour.type)
      if (!node.adjacent_nodes.map(n => n.node).includes(neighbour)) {
        node.adjacent_nodes.push({ neighbour, neighbour_distance })
      }
    })
  }

  getDistance (fromCell, toCell) {
    // [C]lean cell
    // [G]ravel
    // [I]n wormhole
    // [O]ut wormhole
    // [B]oulder
    // also [S]tart & [E]xit
    fromCell = 'CGIOB'.includes(fromCell) ? fromCell : 'C'
    toCell = 'CGIOB'.includes(toCell) ? toCell : 'C'
    return ({
      C: { C: 2, G: 3, I: 2, O: 2, B: Infinity },
      G: { C: 3, G: 4, I: 3, O: 3, B: Infinity },
      I: { C: 2, G: 3, I: 2, O: 0, B: Infinity },
      O: { C: 2, G: 3, I: 2, O: 2, B: Infinity },
      B: { C: Infinity, G: Infinity, I: Infinity, O: Infinity, B: Infinity },
    })[fromCell][toCell]
  }

  findPath () {
    let node_queue = this.flat_grid.slice()

    while (node_queue.length) {
      // go to the closest node in queue
      let closest_node = node_queue.reduce(
        (mem, node) => node.total_distance > mem.total_distance ? mem : node
        , { total_distance: Infinity }
      )
      node_queue.splice(node_queue.indexOf(closest_node), 1)

      this.setAdjacentNodes(closest_node.index)

      closest_node.adjacent_nodes.map(({ neighbour, neighbour_distance }) => {
        if (node_queue.includes(neighbour)) {
          const new_total_distance = closest_node.total_distance + neighbour_distance
          if (new_total_distance < neighbour.total_distance) {
            // refactor: accessing properties outside the class
            neighbour.total_distance = new_total_distance
            neighbour.previous = closest_node
            if (neighbour.type == 'E')
              this.end_node = neighbour
          }
        }
      })
    }

    if (this.end_node) {
      console.log('shortest path:')
      // const tt = (node, fn) => (fn(node), node.previous && tt(node.previous, fn))
      // tt(this.end_node, node => console.log(node.type, node.index, node.total_distance))
      const path = (function traverseBack(node) {
        const current_node = [{ index: node.index, distance: node.total_distance }]
        if (node.previous) {
          return current_node.concat(traverseBack(node.previous))
        } else {
          return current_node
        }
      })(this.end_node)
      return {
        distance: this.end_node.total_distance,
        path,
      }
    } else {
      console.log('No path')
      return false
    }
  }
}

export default Game