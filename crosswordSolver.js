function crosswordSolver(puzzle, words) {
    global.solutions = []
    let nonzeroes = getNonzeroes(puzzle.toString());
    if (isNotEmpty(puzzle) && isNotEmpty(words) &&
        isPuzzleCharsOk(puzzle) && isWordsCharsOk(words) &&
        sumNonzeroes(nonzeroes) === words.length &&
        hasNoDupes(words) &&
        isTwoOrLess(nonzeroes)) {
        let grid = createGrid(puzzle);
        let start = [0, 0]
        findBlanks(grid, words, start);
        //  For checking multiple solutions:
        for (let i = 0; i < global.solutions.length; i++) {
            //console.log(solve(global.solutions[i][1]));
        }
        if (global.solutions.length === 1) {
            return solve(global.solutions[0][1]);
        } else {
            return "Error"
        }
    } else {
        return "Error";
    }
}

/* ===== INPUT VALIDATION FUNCTIONS ===== */

function isNotEmpty(x) {
    return x.length !== 0
}

function isPuzzleCharsOk(puzzle) {
    if (typeof puzzle !== 'string') {
        return false;
    }
    let regex = /[(0-9)(.)(\n)]+/g;
    for (let i = 0; i < puzzle.length; i++) {
        if (!puzzle[i].match(regex)) {
            return false;
        }
    }
    return true;
}

function isWordsCharsOk(words) {
    if (!Array.isArray(words)) {
        return false;
    }
    let regex = /^[a-zA-Z]+$/;
    for (let i = 0; i < words.length; i++) {
        for (let j = 0; j < words[i].length; j++) {
            if (!words[i][j].match(regex)) {
                return false;
            }
        }
    }
    return true;
}

function getNonzeroes(puzzle) {
    let regex = /[1-9]/g;
    let nonzeroes = puzzle.match(regex);
    if (!nonzeroes) return []; // Handle null case
    return nonzeroes;
}

function sumNonzeroes(nonzeroes) {
    let sum = nonzeroes.reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0);
    return sum;
}

function isTwoOrLess(nonzeroes) {
    for (let i = 0; i < nonzeroes.length; i++) {
        if (nonzeroes[i] > 2) {
            return false;
        }
    }
    return true;
}

function hasNoDupes(words) {
    const seen = new Set();
    for (const word of words) {
        if (seen.has(word)) {
            return false; // Duplicate found
        }
        seen.add(word);
    }
    return true; // No duplicates
}

/* ===== SMALL HELPER FUNCTIONS ===== */

function createGrid(puzzle) {
    let grid = puzzle.trim().split("\n").map(line => line.split(""));
    return grid;
}

function copyArray(array, kind) {
    var newArray = [];
    if (kind === "grid") {
        for (var i = 0; i < array.length; i++) {
            newArray.push(array[i].slice());
        }
    } else if (kind === "start") {
        for (var i = 0; i < array.length; i++) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}

function getNextStart(x, y, grid) {
    let nextX = x + 1
    let nextY = y
    if (nextX >= grid[0].length) {
        nextY++
        nextX = 0
    }
    //console.log("Setting next start to:", nextX, nextY)
    return [nextX, nextY]
}

function deceremntNextStart(nextStart, grid, revert) {
    //console.log("From next x and y being:", nextStart)
    let nextX = nextStart[0]
    let nextY = nextStart[1]
    while (revert > 0) {
        nextX--
        if (nextX < 0) {
            if (nextY > 0) {
                nextY = nextY - 1
            }
            nextX = grid[0].length - 1
        }
        revert--
    }
/*     if (nextY === 0 && nextX === 0) {
        nextX = 1
    } */
    //console.log("We decrement next start to:", nextX, nextY)
    return [nextX, nextY]
}

/* ===== SOLVING HELPERS ===== */

function counter(grid, x, y, direction) {
    let n = /[012]/g;
    let count = 0;
    if (direction === "goDown") {
        for (let _; y < grid.length; y++) {
            if (grid[y][x][0].match(n)) {
                count++;
            } else {
                break;
            }
        }
    } else if (direction === "goRight") {
        for (let _; x < grid[y].length; x++) {
            if (grid[y][x][0].match(n)) {
                count++;
            } else {
                break;
            }
        }
    }
    return count;
}

function checkBlankLengths(grid, x, y, tempWords, nextStart, xBlankLength, yBlankLength, letter) {
    if (xBlankLength !== 0) {
        return findRightWord(grid, x, y, tempWords, "horizontal", nextStart, xBlankLength, yBlankLength, letter);
    } else if (yBlankLength !== 0) {
        return findRightWord(grid, x, y, tempWords, "vertical", nextStart, xBlankLength, yBlankLength, letter);
    }
    return "Error"
}

function canFit(word, grid, x, y, direction, xBlankLength, yBlankLength) {
    let length = word.length;
    if (direction === "horizontal") {
        if ((x + length > grid[y].length) || (length !== xBlankLength)) return false; // Out of bounds
        for (let i = 0; i < length; i++) {
            let cell = grid[y][x + i];
            if (cell.length > 1 && cell[1] !== word[i]) {
                return false; // Conflict in existing letters
            }
        }
    } else if (direction === "vertical") {
        if ((y + length > grid.length) || (length !== yBlankLength)) return false; // Out of bounds
        for (let i = 0; i < length; i++) {
            let cell = grid[y + i][x];
            if (cell.length > 1 && cell[1] !== word[i]) {
                return false; // Conflict in existing letters
            }
        }
    }
    return true;
}

function appendLetters(grid, xBlankLength, yBlankLength, x, y, xMatch, yMatch) {
    //append letters to the nums/blanks
    let wordInd = 0;
    let tempX = x;
    let tempY = y;
    if (xBlankLength > 0) {
        for (let _; tempX < x + xBlankLength; tempX++) {
            if (grid[tempY][tempX].length === 1) {
                grid[tempY][tempX] += xMatch[wordInd];
            }
            wordInd++;
        }
    }
    wordInd = 0;
    tempX = x;
    tempY = y;
    if (yBlankLength > 0) {
        for (let _; tempY < y + yBlankLength; tempY++) {
            if (grid[tempY][tempX].length === 1) {
                grid[tempY][tempX] += yMatch[wordInd];
            }
            wordInd++;
        }
    }
    return grid
}

/* ===== SOLVING FUNCTIONS ===== */

function findBlanks(grid, words, startAt) {
    //  Added startAt for not looking at the same number forever (move to the word to be matched)
    //console.log(grid)
    let x = startAt[0]
    let y = startAt[1]
    let revert = 1
    //console.log("Starting at:", x, y)
    for (let _; y < grid.length; y++) {
        for (let _; x < grid[y].length; x++) {
            //console.log("Looking at x:", x, "y:", y, "with character(s):", grid[y][x])
            let output = findBlankLength(grid, words, grid[y][x][0], x, y, revert)
            if (output === "Error") {
                return "Error"
            } else {
                grid = output
            }
            revert++
        }
        x = 0
    }
    if (words.length === 0) {
        //console.log(grid)
        global.solutions.push(["Done", grid])
        /* if (global.solutions.length > 1) {
            //console.log("Error")
            process.exit(0);
        } */
    } else {
        return "Error"
    }
}

function findBlankLength(grid, words, n, x, y, revert) {
    let xBlankLength = 0;
    let yBlankLength = 0;

    //check if cells in each direction is valid
    let isLeftNum = ((x - 1 >= 0) && grid[y][x - 1] && grid[y][x - 1][0] !== '.') ? true : false;
    let isUpNum = ((y - 1 >= 0) && grid[y - 1][x] && grid[y - 1][x][0] !== '.') ? true : false;
    let isRightNum = ((x + 1 < grid[y].length) && grid[y][x + 1] && grid[y][x + 1] !== '.') ? true : false;
    let isDownNum = ((y + 1 < grid.length) && grid[y + 1][x] && grid[y + 1][x] !== '.') ? true : false;

    if (n === '1') {
        if (isLeftNum && isUpNum) {
            return "Error"
        }
        if (!isUpNum && isDownNum) {
            yBlankLength = counter(grid, x, y, "goDown");
        }
        if (!isLeftNum && isRightNum) {
            xBlankLength = counter(grid, x, y, "goRight");
        }
        let output = matchWordLength(grid, words, 0, yBlankLength, x, y, revert)
            if (output === "Error") {
                output = matchWordLength(grid, words, xBlankLength, 0, x, y, revert)
                if (output === "Error") {
                    return "Error"
                } else {
                    grid = output
                }
            } else {
                grid = output
            }
        return "Error";
    } else if (n === '2') {
        if (isLeftNum || isUpNum) {
            return "Error"
        }
        xBlankLength = counter(grid, x, y, "goRight");
        yBlankLength = counter(grid, x, y, "goDown");
        let output = matchWordLength(grid, words, xBlankLength, yBlankLength, x, y, revert)
        if (output === "Error") {
            return "Error";
        } else {
            grid = output
        }
    }
    return grid
}

function matchWordLength(grid, words, xBlankLength, yBlankLength, x, y, revert) {
    let findPair = false;
    let tempWords = words;
    //console.log("xBlankL:", xBlankLength)
    //console.log("yBlankL:", yBlankLength)
    if (xBlankLength !== 0 && yBlankLength !== 0) {
        findPair = true;
    }
    nextStart = getNextStart(x, y, grid)
    // This if might not be needed
    if (nextStart[1] >= grid.length && tempWords.length === 0) {
        return grid
    }
    // If there's a letter in the slot, find a word that starts with that letter
    if (grid[y][x].length === 2) {
        //console.log("Letter already in slot:", x, y, "letter:", grid[y][x][1])
        let output = checkBlankLengths(grid, x, y, tempWords, nextStart, xBlankLength, yBlankLength, grid[y][x][1])
        if (output !== "Error") {
            return output;
        } else {
            nextStart = deceremntNextStart(nextStart, grid, revert)
            //console.log("No words starting with", grid[y][x][1], "found.")
        }
    } else {
        if (!findPair) {
            let output = checkBlankLengths(grid, x, y, tempWords, nextStart, xBlankLength, yBlankLength, null)
            if (output !== "Error") {
                return output;
            } else {
                nextStart = deceremntNextStart(nextStart, grid, revert)
                //console.log("No fitting words found.")
            }
        } else {
            // If we need a pair, try all combinations of two words.
            for (let i = 0; i < tempWords.length; i++) {
                //console.log("Testing:", tempWords[i])
                if (canFit(tempWords[i], grid, x, y, "horizontal", xBlankLength, yBlankLength)) {
                    for (let j = 0; j < tempWords.length; j++) {
                        if (i === j) {
                            continue;
                        }
                        //console.log("With:", tempWords[j])
                        if (canFit(tempWords[j], grid, x, y, "vertical", xBlankLength, yBlankLength)) {
                            if (tempWords[i][0] === tempWords[j][0]) {
                                let matches = [tempWords[i], tempWords[j]];
                                let output = recurseWords(grid, tempWords, nextStart, xBlankLength, yBlankLength, x, y, matches);
                                if (output !== "Error") {
                                    return output;
                                } else {
                                    //console.log("Still testing:", tempWords[i])
                                }
                            }
                        }
                    }
                }
            }
            nextStart = deceremntNextStart(nextStart, grid, revert)
        }
    }
    return "Error"
}

function findRightWord(grid, x, y, words, direction, nextStart, xBlankLength, yBlankLength, startingLetter) {
    let possibleWords = words
    if (startingLetter !== null) {
        possibleWords = words.filter(word => word[0] === startingLetter);
    }
    for (let word of possibleWords) {
        //console.log("Checking if", word, "fits into", x, y, "going", direction)
        if (canFit(word, grid, x, y, direction, xBlankLength, yBlankLength)) {
            //console.log("It does!")
            let matches = []
            if (direction === "horizontal") {
                matches = [word, ""]
            } else {
                matches = ["", word]
            }
            let output = recurseWords(grid, words, nextStart, xBlankLength, yBlankLength, x, y, matches)
            if (output !== "Error") {
                return output
            }
        }
    }
    return "Error"
}

function recurseWords(grid, words, nextStart, xBlankLength, yBlankLength, x, y, matches) {
    let newWords = words.filter(word => (word !== matches[0] && word !== matches[1]));
    let newGrid = copyArray(grid, "grid")
    let newNextStart = copyArray(nextStart, "start")
    newGrid = appendLetters(newGrid, xBlankLength, yBlankLength, x, y, matches[0], matches[1]);
    findBlanks(newGrid, newWords, newNextStart)
    return "Error"
}

/* ===== FINAL FORMATTING FUNCTION ===== */

function solve(grid) {
    //console.log(grid)
    let result = "";
    for (let g = 0; g < grid.length; g++) {
        for (let i = 0; i < grid[g].length; i++) {
            if (grid[g][i][0] === '0' || grid[g][i][0] === '1' || grid[g][i][0] === '2') {
                grid[g][i] = grid[g][i][1];
            }
            result += grid[g][i];
        }
        if (g !== grid.length - 1) {
            result += "\n";
        }
    }
    return result;
}

const puzzle1 = '2001\n0..0\n1000\n0..0'
const words1 = ['casa', 'alan', 'ciao', 'anta']

const puzzle2 = `
...1...........
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

const puzzle5 = '2001\n0..0\n2000\n0..0'
const words5 = ['casa', 'alan', 'ciao', 'anta']

const puzzle6 = '0001\n0..0\n3000\n0..0'
const words6 = ['casa', 'alan', 'ciao', 'anta']

const puzzle7 = '2001\n0..0\n1000\n0..0'
const words7 = ['casa', 'casa', 'ciao', 'anta']

const puzzle8 = ''
const words8 = ['casa', 'alan', 'ciao', 'anta']

const puzzle9 = 123
const words9 = ['casa', 'alan', 'ciao', 'anta']

const puzzle10 = ''
const words10 = 123

const puzzle11 = '2000\n0...\n0...\n0...'
const words11 = ['abba', 'assa']

const puzzle12 = '2001\n0..0\n1000\n0..0'
const words12 = ['aaab', 'aaac', 'aaad', 'aaae']

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



//console.log(crosswordSolver(puzzle1, words1)); //Works
//console.log(crosswordSolver(puzzle2, words2)); //Works
//console.log(crosswordSolver(puzzle3, words3)); //Works
console.log(crosswordSolver(puzzle4, words4)); //Works
//console.log(crosswordSolver(puzzle5, words5)); //Outputs Error correctly
//console.log(crosswordSolver(puzzle6, words6)); //Outputs Error correctly
//console.log(crosswordSolver(puzzle7, words7)); //Outputs Error correctly
//console.log(crosswordSolver(puzzle8, words8)); //Outputs Error correctly
//console.log(crosswordSolver(puzzle9, words9)); //Outputs Error correctly
//console.log(crosswordSolver(puzzle10, words10)); //Outputs Error correctly
//console.log(crosswordSolver(puzzle11, words11)); //Outputs Error correctly
//console.log(crosswordSolver(puzzle12, words12)); //Outputs Error correctly
//console.log(crosswordSolver(puzzleA, wordsA)); //Outputs Error correctly
//console.log(crosswordSolver(puzzleB, wordsB)); //Works
//console.log(crosswordSolver(puzzleC, wordsC)); //Works
//console.log(crosswordSolver(puzzleD, wordsD)); //Works
//console.log(crosswordSolver(puzzleE, wordsE)); //Outputs Error correctly
//console.log(crosswordSolver(puzzleF, wordsF)); //Works
//console.log(crosswordSolver(puzzleG, wordsG)); //Works


//export to test
module.exports = { crosswordSolver };
