function crosswordSolver(puzzle, words) {

    let nonzeroes = getNonzeroes(puzzle.toString());

    if (isNotEmpty(puzzle) && isNotEmpty(words) &&
        isPuzzleCharsOk(puzzle) && isWordsCharsOk(words) &&
        sumNonzeroes(nonzeroes) === words.length &&
        hasNoDupes(words) &&
        isTwoOrLess(nonzeroes)) {
        let grid = createGrid(puzzle);
        findBlanks(grid, words);
        return solve(grid);
    } else {
        return "Error";
    }

}

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

function createGrid(puzzle) {
    let grid = puzzle.split("\n").map(line => line.split(""));
    return grid;
}

function findBlanks(grid, words) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            findBlankLength(grid, words, grid[y][x][0], x, y)
        }
    }
}

function findBlankLength(grid, words, n, x, y) {
    let xBlankLength = 0;
    let yBlankLength = 0;
    let tempX = x;
    let tempY = y;

    //check if cells in each direction is valid
    let isLeftNum = ((x - 1 >= 0) && grid[y][x - 1] && grid[y][x - 1][0] !== '.') ? true : false;
    let isUpNum = ((y - 1 >= 0) && grid[y - 1][x] && grid[y - 1][x][0] !== '.') ? true : false;
    let isRightNum = ((x + 1 < grid[y].length) && grid[y][x + 1] && grid[y][x + 1] !== '.') ? true : false;
    let isDownNum = ((y + 1 < grid.length) && grid[y + 1][x] && grid[y + 1][x] !== '.') ? true : false;

    if (n === '1') {
        if (isLeftNum && isDownNum) {
            yBlankLength = counter(grid, x, y, tempX, tempY, "goDown");
        } else if (isUpNum && isRightNum) {
            xBlankLength = counter(grid, x, y, tempX, tempY, "goRight");
        } else if (isRightNum) {
            xBlankLength = counter(grid, x, y, tempX, tempY, "goRight");
        } else if (isDownNum) {
            yBlankLength = counter(grid, x, y, tempX, tempY, "goDown");
        } else {
            return "Error";
        }
    } else if (n === '2') {
        xBlankLength = counter(grid, x, y, tempX, tempY, "goRight");
        yBlankLength = counter(grid, x, y, tempX, tempY, "goDown");
    } else {
        return "Not Num"
    }
    matchWordLength(grid, words, xBlankLength, yBlankLength, x, y)
}

function counter(grid, x, y, tempX, tempY, direction) {
    let n = /[012]/g;
    let count = 0;
    if (direction === "goDown") {
        for (let _; tempY < grid.length; tempY++) {
            if (grid[tempY][x][0].match(n)) {
                count++;
            } else {
                break;
            }
        }
    } else if (direction === "goRight") {
        for (let _; tempX < grid[y].length; tempX++) {
            if (grid[y][tempX][0].match(n)) {
                count++;
            } else {
                break;
            }
        }
    }
    return count;
}

function matchWordLength(grid, words, xBlankLength, yBlankLength, x, y) {
    let findPair = false;
    let appendedLetter = grid[y][x].length === 2 ? grid[y][x][1] : null;
    let tempWords = words;

    if (xBlankLength !== 0 && yBlankLength !== 0) {
        findPair = true;
    }

    let xMatch = "";
    let yMatch = "";
    //go thru each word, find the one that matches the length of the blank
    for (let i = 0; i < tempWords.length; i++) {
        if (appendedLetter && tempWords[i][0] !== appendedLetter) {
            continue; // Skip words that don't match the appended letter
        }
        if (tempWords[i].length === xBlankLength && xMatch === "") { //if going right
            if (findPair) { //if 2
                matchLetter = tempWords[i][0];
            }
            if (canFit(tempWords[i], grid, x, y, "horizontal")) {
                xMatch = tempWords[i];
            }
            tempWords = tempWords.filter(word => word !== tempWords[i]);
        } else if (tempWords[i].length === yBlankLength && yMatch === "") { //if going down
            if (findPair && (matchLetter === tempWords[i][0])) { //if 2
                if (canFit(tempWords[i], grid, x, y, "vertical")) {
                    yMatch = tempWords[i];
                }
                tempWords = tempWords.filter(word => word !== tempWords[i]);
            } else if (!findPair) { //if 1
                if (canFit(tempWords[i], grid, x, y, "vertical")) {
                    yMatch = tempWords[i];
                }
                tempWords = tempWords.filter(word => word !== tempWords[i]);
            }
        }
        if ((yMatch !== "") && !findPair) {
            break;
        } else if ((xMatch !== "") && !findPair) {
            break;
        } else if (xMatch !== "" && yMatch !== "" && findPair) {
            break;
        }
    }

    // If there's a letter in the slot, find a word that starts with that letter
    if (grid[y][x].length === 2) {
        let appendedLetter = grid[y][x][1];
        let foundWord = findRightWord(grid, x, y, tempWords);
        if (foundWord) {
            xMatch = foundWord;
        }
    }

    appendLetters(grid, xBlankLength, yBlankLength, x, y, xMatch, yMatch);
    console.log(grid)
    console.log(xMatch)
    console.log(yMatch)
    findBlanks(grid, tempWords)

}

function appendLetters(grid, xBlankLength, yBlankLength, x, y, xMatch, yMatch) {
    //append letters to the nums/blanks
    let tempX = x;
    let tempY = y;
    let wordInd = 0;

    if (xBlankLength > 0) {
        for (let _; tempX < x + xBlankLength; tempX++) {
            if (tempX === x) {
                grid[tempY][tempX] = xMatch[wordInd];
            } else {
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
            if (tempY === y) {
                grid[tempY][tempX] = yMatch[wordInd];
            } else {
                grid[tempY][tempX] += yMatch[wordInd];
            }
/*             if (!(wordInd === 0 && xBlankLength > 0)) {
                grid[tempY][tempX] += yMatch[wordInd];
            } */
            wordInd++;
        }
    }
    
    //  Call recursive func here???
}

function findRightWord(grid, x, y, words, direction) {
    let startingLetter = grid[y][x][1]; // The already assigned letter
    let possibleWords = words.filter(word => word[0] === startingLetter);
    for (let word of possibleWords) {
        if (canFit(grid, x, y, word, direction)) {
            return word;
        }
    }

    return null; // No valid word found
}

function canFit(word, grid, x, y, direction) {
    let length = word.length;

    if (direction === "horizontal") {
        if (x + length > grid[y].length) return false; // Out of bounds

        for (let i = 0; i < length; i++) {
            let cell = grid[y][x + i];
            if (cell.length > 1 && cell[1] !== word[i]) {
                return false; // Conflict in existing letters
            }
        }
    } else if (direction === "vertical") {
        if (y + length > grid.length) return false; // Out of bounds

        for (let i = 0; i < length; i++) {
            let cell = grid[y + i][x];
            if (cell.length > 1 && cell[1] !== word[i]) {
                return false; // Conflict in existing letters
            }
        }
    }

    return true;
}


//put letters into nums
function solve(grid) {
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

console.log(crosswordSolver(puzzle1, words1));
console.log(crosswordSolver(puzzle2, words2));
console.log(crosswordSolver(puzzle3, words3));

//export to test
module.exports = { crosswordSolver };
