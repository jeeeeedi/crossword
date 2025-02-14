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
            if (grid[y][x][0] === '2') {
                findBlankLength(grid, '2', x, y, words)
            } else if (grid[y][x][0] === '1') {
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
        if (originalX - 1 >= 0 && grid[originalY][originalX - 1] && grid[originalY][originalX - 1][0] !== '.') {//check if left is nums
            if (originalY - 1 >= 0 && grid[originalY - 1][originalX] && grid[originalY - 1][originalX][0] !== '.') { //check up
                return "Error";
            } else if (originalY + 1 < grid.length && grid[originalY + 1][originalX] && grid[originalY + 1][originalX][0] !== '.') { //check down
                goDown = true;
            } else {
                return "Error";
            }
        } else if (originalY - 1 >= 0 && grid[originalY - 1][originalX] && grid[originalY - 1][originalX][0] !== '.') {//check if up is nums
            if (originalX + 1 < grid[originalY].length && grid[originalY][originalX + 1] && grid[originalY][originalX + 1][0] !== '.') { //check right
                goRight = true;
            } else {
                return "Error";
            }
        } else if (originalX + 1 < grid[originalY].length && grid[originalY][originalX + 1] && grid[originalY][originalX + 1][0] !== '.') {//check right
            if (originalY + 1 < grid.length && grid[originalY + 1][originalX] && grid[originalY + 1][originalX][0] !== '.') { //check down
                return "Error";
            } else {
                goRight = true;
            }
        } else if (originalY + 1 < grid.length && grid[originalY + 1][originalX] && grid[originalY + 1][originalX][0] !== '.') { //check down
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
    let appendedLetter = grid[originalY][originalX].length === 2 ? grid[originalY][originalX][1] : null;
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
            if (canFit(tempWords[i], grid, originalX, originalY, "horizontal")) {
                xMatch = tempWords[i];
            }
            tempWords = tempWords.filter(word => word !== tempWords[i]);
        } else if (tempWords[i].length === yBlankLength && yMatch === "") { //if going down
            if (findPair && (matchLetter === tempWords[i][0])) { //if 2
                if (canFit(tempWords[i], grid, originalX, originalY, "vertical")) {
                    yMatch = tempWords[i];
                }
                tempWords = tempWords.filter(word => word !== tempWords[i]);
            } else if (!findPair) { //if 1
                if (canFit(tempWords[i], grid, originalX, originalY, "vertical")) {
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
    if (grid[originalY][originalX].length === 2) {
        let appendedLetter = grid[originalY][originalX][1];
        let foundWord = findRightWord(grid, originalX, originalY, tempWords);
        if (foundWord) {
            xMatch = foundWord;
        }
    }

    appendLetters(grid, xBlankLength, yBlankLength, originalX, originalY, xMatch, yMatch);
}

function appendLetters(grid, xBlankLength, yBlankLength, originalX, originalY, xMatch, yMatch) {
    //append letters to the nums/blanks
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

console.log(crosswordSolver(puzzle1, words1));
console.log(crosswordSolver(puzzle2, words2));

//export to test
module.exports = { crosswordSolver };
