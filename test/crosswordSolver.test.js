//crosswordSolver.test.js
const assert = require('assert');
const { crosswordSolver/* , getNonzeroes, sumNonzeroes, isTwoOrLess, hasNoDupes */ } = require('../crosswordSolver');

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

describe('crosswordSolver', function() {
    it('should return "ok" for valid puzzle and words', function() {
        assert.strictEqual(crosswordSolver(puzzle1, words1), 'ok');
        assert.strictEqual(crosswordSolver(puzzle2, words2), 'ok');
        assert.strictEqual(crosswordSolver(puzzle3, words3), 'ok');
        assert.strictEqual(crosswordSolver(puzzle4, words4), 'ok');

    });

    it('should return "Error" for invalid puzzle and words', function() {
        assert.strictEqual(crosswordSolver(puzzleErr1, wordsErr1), 'Error'); // Test mismatch between number of input words and puzzle starting cells
        assert.strictEqual(crosswordSolver(puzzleErr2, wordsErr2), 'Error'); // Test starting words higher than 2
        assert.strictEqual(crosswordSolver(puzzleErr3, wordsErr3), 'Error'); // Test words repetition
        assert.strictEqual(crosswordSolver(puzzleErr4, wordsErr4), 'Error'); // Test empty puzzle
        assert.strictEqual(crosswordSolver(puzzleErr5, wordsErr5), 'Error'); // Test wrong format checks
        assert.strictEqual(crosswordSolver(puzzleErr6, wordsErr6), 'Error'); // Test wrong format checks
        //assert.strictEqual(crosswordSolver(puzzleErr7, wordsErr7), 'Error'); // Test multiple solutions
        //assert.strictEqual(crosswordSolver(puzzleErr8, wordsErr8), 'Error'); // Test no solution
    });
});
/* 
describe('sumNonzeroes', function() {
    it('should return the sum of non-zero digits in the puzzle', function() {
        const puzzle = `2001
0..0
1000
0..0`;
        assert.strictEqual(sumNonzeroes(puzzle), 4);
    });

    it('should return 0 if there are no non-zero digits', function() {
        const puzzle = `0000
0..0
0000
0..0`;
        assert.strictEqual(sumNonzeroes(puzzle), 0);
    });
});

describe('hasNoDupes', function() {
    it('should return true if there are no duplicate words', function() {
        assert.strictEqual(hasNoDupes(words1), true);
        assert.strictEqual(hasNoDupes(words2), true);
        assert.strictEqual(hasNoDupes(words3), true);
        assert.strictEqual(hasNoDupes(words4), true);

    });

    it('should return false if there are duplicate words', function() {
        assert.strictEqual(hasNoDupes(wordsErr3), false);
    });
}); */