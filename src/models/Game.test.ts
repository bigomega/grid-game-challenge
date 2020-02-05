import Game from './Game';

enum CellTypes { Boulder, Gravel, InWormhole, OutWormhole, Start, End, Clear }
const cell_type_map:any = {
	'-': CellTypes.Clear,
	B: CellTypes.Boulder,
	G: CellTypes.Gravel,
	I: CellTypes.InWormhole,
	O: CellTypes.OutWormhole,
	S: CellTypes.Start,
	E: CellTypes.End,
}

test('works for a sample map', () => {
	const mapgen = `\
-I----
-SBGBO
-BEB--
I-----`.split('\n').map(row => row.split('').map(cell => cell_type_map[cell]))
	let game = new Game(mapgen, [4,6])
	let solution = game.findPath()
	expect(solution.distance).toBe(12);
});


test('finds no solution case', () => {
	const mapgen = `\
-I----
-SBGBO
-BEB--
I-B---`.split('\n').map(row => row.split('').map(cell => cell_type_map[cell]))
	let game = new Game(mapgen, [4,6])
	let solution = game.findPath()
	expect(solution.distance).toBe(-1);
});
