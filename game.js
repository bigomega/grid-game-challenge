/*
=== BASIC grid ===
- Queue starting cell
- Iterate Queue
	- mark visited
	- dequeue from Queue
	- STOP if reached end
	- add neighbours to Aueue
- if not reached end, no path
*/
Number.prototype[Symbol.iterator] = function*(){
	for (var i=0; i<=this; i++) {
		yield i;
	}
}

const Game = window.game = {}

const mapgen = `\
S-G-
-BGB
-B--
---E`
// TK GET as inpout
game.S = [0,0]
game.grid = mapgen.split('\n').map(r => r.split(''))

game.grid = game.grid.map(r => r.map(cell => {
	return { val: cell, dist: Infinity, previous: null, optimalPrevious: null, next: [] }
}))

// THIS iS SHITTY TK
const getCell = cell => (game.grid[cell[0]]||[])[cell[1]]

function moveNext(cell) {
	//if Portal, then next is the exits (TK)

	// can write this directions better
	;[[-1,0], [1,0], [0,-1], [0,1]].map(dir => {
		let nextIndex = [cell[0] + dir[0], cell[1] + dir[1]]
		let next = getCell(nextIndex)
		// if out of bounds, skip
		if (!next)
			return
		// if block, skip
		if (next.val == 'B')
			return
		// no infinite looping
		if (next == getCell(cell).previous)
			return

		next.previous = getCell(cell)
		next.dist = next.previous.dist + 1
		if(next.val == 'G')
			next.dist++
		queue.push(nextIndex)
	})
}

let queue = [game.S]
let init = getCell(game.S)
init.dist = 0
n =0
while(queue.length || n > 100) {
	n++
	console.log(queue)
	let cell = queue.shift()
	// this retrieval is big and repeating, have a fn
	if (getCell(cell).val == 'E') {
		console.log("END", getCell(cell))
		break
	}

	moveNext(cell)
}
// If not reached, gotta say


// TK rename variables

// console.log(game.grid.map(r => JSON.stringify(r)))