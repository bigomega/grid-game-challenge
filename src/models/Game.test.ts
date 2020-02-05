import Game from './Game';

test('works for a sample map', () => {
	const mapgen = `\
-I----
-SBGBO
-BEB--
I-----`.replace(/-/g, 'C')
	let game = new Game(mapgen, [4,6])
	let solution = game.findPath()
	expect(solution.distance).toBe(12);
});


test('finds no solution case', () => {
	const mapgen = `\
-I----
-SBGBO
-BEB--
I-B---`.replace(/-/g, 'C')
	let game = new Game(mapgen, [4,6])
	let solution = game.findPath()
	expect(solution.distance).toBe(-1);
});
