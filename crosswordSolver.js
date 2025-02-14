function crosswordSolver(puzzle, words) {

    let nonzeroes = getNonzeroes(puzzle.toString());

    if (isNotEmpty(puzzle) && isNotEmpty(words) &&
        isPuzzleCharsOk(puzzle) && isWordsCharsOk(words) &&
        sumNonzeroes(nonzeroes) === words.length &&
        hasNoDupes(words) &&
        isTwoOrLess(nonzeroes)) {
        let grid = createGrid(puzzle);
        findBlanks(grid, words);

        return solve(puzzle, words);
    } else {
        return "Error";
    }

}

//errors:
//ok- look for numbers not 0, if the total is not eq to the number of words, then error
//ok- no repeated words
//ok- puzzle != ''
//ok- puzzle should contain only numbers, '.', '\n'
//ok- word should be an array of strings containing only letters
//unique solution?

function isNotEmpty(x) {
    if (x.length === 0) {
        return false;
    }
    return true;
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

//algorigthm:
//if number is not 0, that is a starting point.
//indexN: need to count how many words have the same first letter.
//number != 0 look for a match with indexN
//if you encounter another nonzero, check if that letter could be a starting letter, and check if it has the right qty
//if not, go back and try another; if you cant find others, error --- backtracking?
//

function createGrid(puzzle) {
    let grid = puzzle.split("\n").map(line => line.split(""));
    console.log(grid);
    return grid;
}

function findBlanks(grid, words) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x][0] === '2') {
                console.log("2 at:", x, y);
                findBlankLength(grid, '2', x, y, words)
            } else if (grid[y][x][0] === '1') {
                console.log("1 at:", x, y);
                findBlankLength(grid, '1', x, y, words)
            }
        }
    }
}

function findBlankLength(grid, int, x, y, words) {
    let xBlankLength = 0;
    let yBlankLength = 0;
    let goRight = false;
    let goDown = false;
    let originalX = x;
    let originalY = y;
    if (int === '1') {
        if (originalX - 1 >= 0 && grid[originalY][originalX - 1][0] !== '.') {//check if left is nums
            if (originalY - 1 >= 0 && grid[originalY - 1][originalX][0] !== '.') { //check up
                return "Error";
            } else if (originalY + 1 < grid.length && grid[originalY + 1][originalX][0] !== '.') { //check down
                goDown = true;
            } else {
                return "Error";
            }
        } else if (originalY - 1 >= 0 && grid[originalY - 1][originalX][0] !== '.') {//check if up is nums
            if (originalX + 1 < grid[originalY].length && grid[originalY][originalX + 1][0] !== '.') { //check right
                goRight = true;
            } else {
                return "Error";
            }
        } else if (originalX + 1 < grid[originalY].length && grid[originalY][originalX + 1][0] !== '.') {//check right
            if (originalY + 1 < grid.length && grid[originalY + 1][originalX][0] !== '.') { //check down
                return "Error";
            } else {
                goRight = true;
            }
        } else if (originalY + 1 < grid.length && grid[originalY + 1][originalX][0] !== '.') { //check down
            goDown = true;
        } else {
            return "Error";
        }
        if (goRight) {
            for (let _; x < grid[originalY].length; x++) {
                if (grid[originalY][x][0] !== '0' && grid[originalY][x][0] !== '1' && grid[originalY][x][0] !== '2') {
                    break;
                } else {
                    xBlankLength++;
                }
            }
        } else if (goDown) {
            for (let _; y < grid.length; y++) {
                if (grid[y][originalX][0] !== '0' && grid[y][originalX][0] !== '1' && grid[y][originalX][0] !== '2') {
                    break;
                } else {
                    yBlankLength++;
                }
            }
        }

    } else if (int === '2') {
        for (let _; x < grid[originalY].length; x++) {
            if (grid[originalY][x][0] !== '0' && grid[originalY][x][0] !== '1' && grid[originalY][x][0] !== '2') {
                break;
            } else {
                xBlankLength++;
            }
        }
        for (let _; y < grid.length; y++) {
            if (grid[y][originalX][0] !== '0' && grid[y][originalX][0] !== '1' && grid[y][originalX][0] !== '2') {
                break;
            } else {
                yBlankLength++;
            }
        }
    }
    matchWordLength(grid, words, xBlankLength, yBlankLength, originalX, originalY)
}

/* function checkLetters(word, ) {
    //loop thru grid, find 
    let x = originalX
    let y = originalY
    let wordInd = 0
    //  grid[y][x][0]

    if (xBlankLength > 0) {
        for (let _; x < originalX+xBlankLength; x++) {
            grid[y][x] += xMatch[wordInd]
            wordInd++
        }
    }
    wordInd = 0
    x = originalX
    y = originalY
    if (yBlankLength > 0) {
        for (let _; y < originalY+yBlankLength; y++) {
            if (!(wordInd === 0 && xBlankLength > 0)) {
            grid[y][x] += yMatch[wordInd]
            }
            wordInd++
        }
    }
} */

function matchWordLength(grid, words, xBlankLength, yBlankLength, originalX, originalY) {
    let findPair = false;
    let matchLetter = "";

    if (xBlankLength !== 0 && yBlankLength !== 0) {
        findPair = true;
    }

    let xMatch = "";
    let yMatch = "";

    for (let i = 0; i < words.length; i++) {
        if (words[i].length === xBlankLength && xMatch === "") {
            console.log("matches x: ", words[i]);
            if (findPair) {
                matchLetter = words[i][0];
            }
            xMatch = words[i];
            words = words.filter(word => word !== words[i]);
        } else if (words[i].length === yBlankLength && yMatch === "") {
            if (findPair && (matchLetter === words[i][0])) {
                console.log("matches y: ", words[i]);
                yMatch = words[i];
                words = words.filter(word => word !== words[i]);
            } else if (!findPair) {
                console.log("matches y: ", words[i]);
                yMatch = words[i];
                words = words.filter(word => word !== words[i]);
            }
        }
        if ((yMatch !== "") && !findPair) {
            console.log("Matched down:", yMatch);
            break;
        } else if ((xMatch !== "") && !findPair) {
            console.log("Matched right: ", xMatch);
            break;
        } else if (xMatch !== "" && yMatch !== "" && findPair) {
            console.log("Pair:");
            console.log(xMatch);
            console.log(yMatch);
            break;
        }
    }

    let x = originalX;
    let y = originalY;
    let wordInd = 0;

    if (xBlankLength > 0) {
        for (let _; x < originalX + xBlankLength; x++) {
            grid[y][x] += xMatch[wordInd];
            wordInd++;
        }
    }

    wordInd = 0;
    x = originalX;
    y = originalY;

    if (yBlankLength > 0) {
        for (let _; y < originalY + yBlankLength; y++) {
            if (!(wordInd === 0 && xBlankLength > 0)) {
                grid[y][x] += yMatch[wordInd];
            }
            wordInd++;
        }
    }

    //  Call recursive func here

    console.log(words)
    console.log(grid)
}



//partial solution putting characters into blanks
function solve(puzzle, words) {
    let result = '';
    let wordIndex = 0;
    let charIndex = 0;

    let isNum = /[0-9]/g;

    for (let p = 0; p < puzzle.length; p++) {
        if (puzzle[p].match(isNum)) {
            let num = Number(puzzle[p]);
            if (num >= 0 && wordIndex < words.length) {
                result += words[wordIndex][charIndex];
                charIndex++;
                if (charIndex >= words[wordIndex].length) {
                    wordIndex++;
                    charIndex = 0;
                }
            } else {
                result += puzzle[p];
            }
        } else {
            result += puzzle[p];
        }
    }
    return result;
}

const puzzle1 = '2001\n0..0\n1000\n0..0'
const words1 = ['casa', 'alan', 'ciao', 'anta']

/* output: `
casa
i..l
anta
o..n`
*/

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

console.log(crosswordSolver(puzzle1, words1));
//console.log(crosswordSolver(puzzle2, words2));

//export to test
module.exports = { crosswordSolver };
