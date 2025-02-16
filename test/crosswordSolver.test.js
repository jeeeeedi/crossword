//crosswordSolver.test.js
const assert = require('assert');
const { crosswordSolver } = require('../crosswordSolver');

// AUDIT: Valid cases
const puzzle1 = '2001\n0..0\n1000\n0..0'
const words1 = ['casa', 'alan', 'ciao', 'anta']

const puzzle2 = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`
const words2 = [
    'sun',
    'sunglasses',
    'suncream',
    'swimming',
    'bikini',
    'beach',
    'icecream',
    'tan',
    'deckchair',
    'sand',
    'seaside',
    'sandals',
]

const puzzle3 = `..1.1..1...
10000..1000
..0.0..0...
..1000000..
..0.0..0...
1000..10000
..0.1..0...
....0..0...
..100000...
....0..0...
....0......`
const words3 = [
    'popcorn',
    'fruit',
    'flour',
    'chicken',
    'eggs',
    'vegetables',
    'pasta',
    'pork',
    'steak',
    'cheese',
]

const puzzle4 = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`
const words4 = [
    'sun',
    'sunglasses',
    'suncream',
    'swimming',
    'bikini',
    'beach',
    'icecream',
    'tan',
    'deckchair',
    'sand',
    'seaside',
    'sandals',
].reverse()

// AUDIT: Invalid cases
const puzzleErr1 = '2001\n0..0\n2000\n0..0'
const wordsErr1 = ['casa', 'alan', 'ciao', 'anta']
const puzzleErr2 = '0001\n0..0\n3000\n0..0'
const wordsErr2 = ['casa', 'alan', 'ciao', 'anta']
const puzzleErr3 = '2001\n0..0\n1000\n0..0'
const wordsErr3 = ['casa', 'casa', 'ciao', 'anta']
const puzzleErr4 = ''
const wordsErr4 = ['casa', 'alan', 'ciao', 'anta']
const puzzleErr5 = 123
const wordsErr5 = ['casa', 'alan', 'ciao', 'anta']
const puzzleErr6 = ''
const wordsErr6 = 123
const puzzleErr7 = '2000\n0...\n0...\n0...'
const wordsErr7 = ['abba', 'assa']
const puzzleErr8 = '2001\n0..0\n1000\n0..0'
const wordsErr8 = ['aaab', 'aaac', 'aaad', 'aaae']

// Run tests
describe('crosswordSolver', function () {
    //Audit valid cases
    it('should return solution for valid crossword', function () {
        assert.strictEqual(crosswordSolver(puzzle1, words1), `casa
i..l
anta
o..n`);
        assert.strictEqual(crosswordSolver(puzzle2, words2),
            `...s...........
..sunglasses...
...n....u......
.s......n...s..
.w....deckchair
bikini..r...n..
.m.....seaside.
.m.b....a.a....
.icecream.n....
.n.a......d....
.g.c.....tan...
...h......l....
..........s....`);
        assert.strictEqual(crosswordSolver(puzzle3, words3), `..p.f..v...
flour..eggs
..p.u..g...
..chicken..
..o.t..t...
pork..pasta
..n.s..b...
....t..l...
..cheese...
....a..s...
....k......`);
        assert.strictEqual(crosswordSolver(puzzle4, words4), `...s...........
..sunglasses...
...n....u......
.s......n...s..
.w....deckchair
bikini..r...n..
.m.....seaside.
.m.b....a.a....
.icecream.n....
.n.a......d....
.g.c.....tan...
...h......l....
..........s....`);

    });
//Audit invalid cases
    it('should return "Error" for invalid crossword', function () {
        assert.strictEqual(crosswordSolver(puzzleErr1, wordsErr1), 'Error'); // Test mismatch between number of input words and puzzle starting cells
        assert.strictEqual(crosswordSolver(puzzleErr2, wordsErr2), 'Error'); // Test starting words higher than 2
        assert.strictEqual(crosswordSolver(puzzleErr3, wordsErr3), 'Error'); // Test words repetition
        assert.strictEqual(crosswordSolver(puzzleErr4, wordsErr4), 'Error'); // Test empty puzzle
        assert.strictEqual(crosswordSolver(puzzleErr5, wordsErr5), 'Error'); // Test wrong format checks
        assert.strictEqual(crosswordSolver(puzzleErr6, wordsErr6), 'Error'); // Test wrong format checks
        assert.strictEqual(crosswordSolver(puzzleErr7, wordsErr7), 'Error'); // Test multiple solutions
        assert.strictEqual(crosswordSolver(puzzleErr8, wordsErr8), 'Error'); // Test no solution
    });
//Valid edge cases
    it('should return solution for valid edge cases', function () {
        assert.strictEqual(crosswordSolver(puzzleAn, wordsAn), `An\n..`); // Minimum puzzle is 2x2
        assert.strictEqual(crosswordSolver(puzzleB, wordsB), `pear\nlard\nknee\n..a.`);
        assert.strictEqual(crosswordSolver(puzzleC, wordsC), `dork\no..i\noats\nr..s`);
        assert.strictEqual(crosswordSolver(puzzleD, wordsD), `mars\ne.a.\ntnt.\n..s.`);
        assert.strictEqual(crosswordSolver(puzzleF, wordsF),
            `........c.........
.....g..h.........
.....r.peaches....
banana..r.........
.....p..r.........
....berries.......
.....f..e.....m.g.
..pear..strawberry
.....u........l.a.
....pineapple.o.p.
.....t..p.l...n.e.
........p.u.....s.
........l.m.......
........e.........`);
        assert.strictEqual(crosswordSolver(puzzleG, wordsG),
            `........c.........
.....g..h...m.....
.....r.peaches....
banana..r...l.....
.....p..r...o.....
....berries.n.....
.....f..e.......g.
..pear..strawberry
.....u..........a.
....pineapple...p.
.....t..p.l.....e.
........p.u.....s.
........l.m.......
........e.........`);

    });
    //Invalid edge cases
    it('should return "Error" for invalid edge cases', function () {
        assert.strictEqual(crosswordSolver(puzzleErr9, wordsErr9), 'Error'); // Invalid case, multiple possible solutions
        assert.strictEqual(crosswordSolver(puzzleErr10, wordsErr10), 'Error'); // Invalid case, extra words that don’t fit
        assert.strictEqual(crosswordSolver(puzzleErr11, wordsErr11), 'Error'); // Invalid case, missing words to complete the puzzle
        assert.strictEqual(crosswordSolver(puzzleErr12, wordsErr12), 'Error'); // Invalid case, words provided do not match the lengths needed
        assert.strictEqual(crosswordSolver(puzzleErr13, wordsErr13), 'Error'); // Invalid: puzzle has negative num
        assert.strictEqual(crosswordSolver(puzzleErr14, wordsErr14), 'Error'); // Invalid: word has $
        assert.strictEqual(crosswordSolver(puzzleErr15, wordsErr15), 'Error'); // Invalid: puzzle contains just 1s
        assert.strictEqual(crosswordSolver(puzzleA, wordsA), 'Error'); // Invalid: multiple solutions
        assert.strictEqual(crosswordSolver(puzzleE, wordsE), 'Error'); // Invalid: melon and lemon interchangable
    });
});

// EDGE CASES
const puzzleAn = `10\n..`;
const wordsAn = ['An'];

const puzzleA =
    "2010\n" +
    "0.0.\n" +
    "1000\n" +
    "0.0.";
const wordsA = ['dove', 'deer', 'vase', 'easy'];

const puzzleB =
    "1010\n" +
    "1000\n" +
    "1000\n" +
    "..0.";

const wordsB = ['knee', 'lard', 'area', 'pear'];

const puzzleC =
    "2001\n" +
    "0..0\n" +
    "1000\n" +
    "0..0";

const wordsC = ['door', 'dork', 'oats', 'kiss'];

const puzzleD =
    "2010\n" +
    "0.0.\n" +
    "100.\n" +
    "..0.";
const wordsD = ['mars', 'met', 'rats', 'tnt'];

// 18 across
// 14 down
// melon and lemon interchangable, should return error
const puzzleE =
    "........1.........\n" +
    ".....1..0...1.....\n" +
    ".....0.1000000....\n" +
    "100000..0...0.....\n" +
    ".....0..0...0.....\n" +
    "....1000000.0.....\n" +
    ".....0..0.....1.1.\n" +
    "..1000..1000000000\n" +
    ".....0........0.0.\n" +
    "....100010100.0.0.\n" +
    ".....0..0.0...0.0.\n" +
    "........0.0.....0.\n" +
    "........0.0.......\n" +
    "........0.........\n";
const wordsE = ['strawberry', 'grapes', 'lemon', 'melon', 'peaches', 'plum', 'pineapple', 'apple', 'grapefruit', 'banana', 'berries', 'pear', 'cherries'];

// lemon removed, should return solution
const puzzleF =
    "........1.........\n" +
    ".....1..0.........\n" +
    ".....0.1000000....\n" +
    "100000..0.........\n" +
    ".....0..0.........\n" +
    "....1000000.......\n" +
    ".....0..0.....1.1.\n" +
    "..1000..1000000000\n" +
    ".....0........0.0.\n" +
    "....100010100.0.0.\n" +
    ".....0..0.0...0.0.\n" +
    "........0.0.....0.\n" +
    "........0.0.......\n" +
    "........0.........\n";
const wordsF = ['strawberry', 'grapes', 'melon', 'peaches', 'plum', 'pineapple', 'apple', 'grapefruit', 'banana', 'berries', 'pear', 'cherries'];

// lemon removed (different spot), should return solution
const puzzleG =
    "........1.........\n" +
    ".....1..0...1.....\n" +
    ".....0.1000000....\n" +
    "100000..0...0.....\n" +
    ".....0..0...0.....\n" +
    "....1000000.0.....\n" +
    ".....0..0.......1.\n" +
    "..1000..1000000000\n" +
    ".....0..........0.\n" +
    "....100010100...0.\n" +
    ".....0..0.0.....0.\n" +
    "........0.0.....0.\n" +
    "........0.0.......\n" +
    "........0.........\n";
const wordsG = ['strawberry', 'grapes', 'melon', 'peaches', 'plum', 'pineapple', 'apple', 'grapefruit', 'banana', 'berries', 'pear', 'cherries'];


// Invalid edge cases
const puzzleErr9 = `2002
0..0
0..0
2000`;
const wordsErr9 = ['team', 'mole', 'leaf', 'meta'];

const puzzleErr10 = `2001
0..0
1000
0..0`;
const wordsErr10 = ['home', 'fire', 'code', 'hope', 'java'];

const puzzleErr11 = `2001
0..0
1000
0..0`;
const wordsErr11 = ['star', 'lion', 'only']; // Only 3 words instead of 4

const puzzleErr12 = `3000
0..0
0..0
2000`;
const wordsErr12 = ['longer', 'word', 'fits', 'nope'];

const puzzleErr13 = '200-1\n0..0\n2000\n0..0'
const wordsErr13 = ['casa', 'alan', 'ciao', 'anta']
const puzzleErr14 = '2001\n0..0\n1000\n0..0'
const wordsErr14 = ['ca$a', 'alan', 'ciao', 'anta']
const puzzleErr15 = `1111
1111
1111
1111`;
const wordsErr15 = ['word', 'game', 'test', 'play'];