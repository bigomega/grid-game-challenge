import Grid from './Grid';

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
	let grid = new Grid(mapgen, [4,6])
	let solution = grid.findPath()
	expect(solution.distance).toBe(12);
});

test('uses portal', () => {
	const mapgen = `\
--IG--
-SGGEO
-GGG--
I-----`.split('\n').map(row => row.split('').map(cell => cell_type_map[cell]))
	let grid = new Grid(mapgen, [4,6])
	let solution = grid.findPath()
	expect(solution.distance).toBe(6);
});

test('prefers gravel when necessary', () => {
	const mapgen = `\
-SIB--
--GGEG
-GBG--
O-----`.split('\n').map(row => row.split('').map(cell => cell_type_map[cell]))
	let grid = new Grid(mapgen, [4,6])
	let solution = grid.findPath()
	expect(solution.distance).toBe(12);
});


test('finds no solution case', () => {
	const mapgen = `\
-I----
-SBGBO
-BEB--
I-B---`.split('\n').map(row => row.split('').map(cell => cell_type_map[cell]))
	let grid = new Grid(mapgen, [4,6])
	let solution = grid.findPath()
	expect(solution.distance).toBe(-1);
});

test('doesn\'t break without start or end', () => {
	let mapgen = '--BE-'.split('\n').map(row => row.split('').map(cell => cell_type_map[cell]))
	let grid = new Grid(mapgen, [1,5])
	let solution = grid.findPath()
	expect(solution.distance).toBe(-1);

	mapgen = '--SB-'.split('\n').map(row => row.split('').map(cell => cell_type_map[cell]))
	grid = new Grid(mapgen, [1,5])
	solution = grid.findPath()
	expect(solution.distance).toBe(-1);
});
