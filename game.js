Number.prototype[Symbol.iterator] = function*(){
	for (var i=0; i<=this; i++) {
		yield i;
	}
}

const Game = window.game = {
	constructor () {
		return this
	},

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
			if (x >= game.size[0] || y >= game.size[1])
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
	},

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
}

class Node {
	constructor(index, type, total_distance = Infinity) {
		this.index = index
		this.type = type
		this.total_distance = total_distance
		this.visited = false
		this.adjacent_nodes = []
		this.previous = null // for tracing the final path
		return this
	}

	setVisited () {
		this.visited = true
	}
}

// class Graph {
// 	constructor () {
// 		self.graph = {}
// 	}
// }


const mapgen = `\
-I----
-SBGBO
-BEB--
I-----`.replace(/-/g, 'C')
// TK GET as inpout
game.StartIndex = [1, 1]
game.size = [4,6]

// do these in the constructor
game.portalOuts = []
game.grid = mapgen.split('\n').map((row, x) => {
	let arr = row.split('')
	return arr.map((cell, y) => {
		const node = new Node([x, y], cell, Infinity)
		if(cell == 'O')
			game.portalOuts.push(node)
		return node
	})
})
game.head_node = game.grid[game.StartIndex[0]][game.StartIndex[1]]
game.end_node = null
game.head_node.total_distance = 0

let queue = game.grid.flat(2)

while (queue.length) {
	// go to the closest node in queue
	let closest_node = queue.reduce(
		(mem, node) => node.total_distance > mem.total_distance ? mem : node
		, { total_distance: Infinity }
	)
	queue.splice(queue.indexOf(closest_node), 1)

	game.setAdjacentNodes(closest_node.index)

	closest_node.adjacent_nodes.map(function({ neighbour, neighbour_distance }) {
		if (queue.includes(neighbour)) {
			const new_total_distance = closest_node.total_distance + neighbour_distance
			if (new_total_distance < neighbour.total_distance) {
				// refactor: accessing properties outside the class
				neighbour.total_distance = new_total_distance
				neighbour.previous = closest_node
				if (neighbour.type == 'E')
					game.end_node = neighbour
			}
		}
	})
}

if (game.end_node) {
	console.log('shortest path:')
	const traverseBack = (node, fn) => (fn(node), node.previous && traverseBack(node.previous, fn))
	traverseBack(game.end_node, node => console.log(node.type, node.index, node.total_distance))
} else {
	console.log('No path')
}