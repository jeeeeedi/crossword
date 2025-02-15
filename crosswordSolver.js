function crosswordSolver(puzzle, words) {

    let nonzeroes = getNonzeroes(puzzle.toString());

    if (isNotEmpty(puzzle) && isNotEmpty(words) &&
        isPuzzleCharsOk(puzzle) && isWordsCharsOk(words) &&
        sumNonzeroes(nonzeroes) === words.length &&
        hasNoDupes(words) &&
        isTwoOrLess(nonzeroes)) {
        let grid = createGrid(puzzle);
        let start = [0, 0]
        findBlanks(grid, words, start);
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
    let grid = puzzle.trim().split("\n").map(line => line.split(""));
    return grid;
}

function findBlanks(grid, words, startAt) {
    //  Added startAt for not looking at the same number forever (move to the word to be matched)
    let x = startAt[0]
    let y = startAt[1]
    console.log("findBlanks running on grid:", grid, "x:", x, "y:", y)
    for (let _; y < grid.length; y++) {
        for (let _; x < grid[y].length; x++) {
            output = findBlankLength(grid, words, grid[y][x][0], x, y)
            if (output === "Not Num") {
                continue
            } else if (output === "Error") {
                return "Error"
            } else if (output[0] === "Done") {
                console.log("Done")
                return output
            } else {
                grid = output
            }
        }
        x = 0
    }
    return ["Done", grid]
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
        if (isLeftNum && isUpNum) {
            return "Error"
        }
        if (!isUpNum && isDownNum) {
            yBlankLength = counter(grid, x, y, tempX, tempY, "goDown");
            console.log("For position", x, y)
            console.log("yBlankLength =", yBlankLength)
            console.log("xBlankLength =", xBlankLength)
            output = matchWordLength(grid, words, xBlankLength, yBlankLength, x, y)
            if (output === "Error") {
                return "Error";
            } else if (output[0] === "Done") {
                return output
            } else {
                grid = output
            }
        } else if (!isLeftNum && isRightNum) {
            xBlankLength = counter(grid, x, y, tempX, tempY, "goRight");
            console.log("For position", x, y)
            console.log("yBlankLength =", yBlankLength)
            console.log("xBlankLength =", xBlankLength)
            output = matchWordLength(grid, words, xBlankLength, yBlankLength, x, y)
            if (output === "Error") {
                return "Error";
            } else if (output[0] === "Done") {
                return output
            } else {
                grid = output
            }
        } else {
            return "Error";
        }
    } else if (n === '2') {
        if (isLeftNum || isUpNum) {
            return "Error"
        }
        xBlankLength = counter(grid, x, y, tempX, tempY, "goRight");
        yBlankLength = counter(grid, x, y, tempX, tempY, "goDown");
        console.log("For position", x, y)
        console.log("yBlankLength =", yBlankLength)
        console.log("xBlankLength =", xBlankLength)
        output = matchWordLength(grid, words, xBlankLength, yBlankLength, x, y)
        if (output === "Error") {
            return "Error";
        } else if (output[0] === "Done") {
            return output
        } else {
            grid = output
        }
    } else {
        return "Not Num"
    }
    return grid
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

    // If there's a letter in the slot, find a word that starts with that letter
    if (grid[y][x].length === 2) {
        if (xBlankLength !== 0) {
            console.log("Matching word horizontally at:", x, y)
            let foundWord = findRightWord(grid, x, y, tempWords, "horizontal");
            if (typeof foundWord !== "string") {
                return "Error"
            }
            xMatch = foundWord;
            tempWords = tempWords.filter(word => word !== foundWord);
        } else if (yBlankLength !== 0) {
            console.log("Matching word vertically at:", x, y)
            let foundWord = findRightWord(grid, x, y, tempWords, "vertical");
            if (typeof foundWord !== "string") {
                return "Error"
            }
            yMatch = foundWord;
            tempWords = tempWords.filter(word => word !== foundWord);
        }
    } else {
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
                    console.log("Set xMatch to:", xMatch)
                }
            } else if (tempWords[i].length === yBlankLength && yMatch === "") { //if going down
                if (findPair && (matchLetter === tempWords[i][0])) { //if 2
                    if (canFit(tempWords[i], grid, x, y, "vertical")) {
                        yMatch = tempWords[i];
                        console.log("Set yMatch to:", yMatch)
                    }
                } else if (!findPair) { //if 1
                    if (canFit(tempWords[i], grid, x, y, "vertical")) {
                        yMatch = tempWords[i];
                        console.log("Set yMatch to:", yMatch)
                    }
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
    }
    if (xMatch === null || yMatch === null) {
        return "Error"
    }
    if (xBlankLength > 0 && xMatch === "") {
        return "Error"; // or handle backtracking
    }
    if (yBlankLength > 0 && yMatch === "") {
        return "Error"; // or handle backtracking
    }
    tempWords = tempWords.filter(word => (word !== xMatch && word !== yMatch));
    appendLetters(grid, xBlankLength, yBlankLength, x, y, xMatch, yMatch);
    console.log("findPair:", findPair)
    console.log("xMatch:", xMatch)
    console.log("yMatch:", yMatch)
    console.log(grid)

    let nextX = x + 1
    let nextY = y
    if (nextX >= grid[0].length) {
        nextY++
        nextX = 0
    }
    console.log("nextY:", nextY)
    if (nextY >= grid.length) {
        process.exit(0);
        return ["Done", grid]
    }
    nextStart = [nextX, nextY]
    console.log("running findBlanks again...")
    console.log("nextStart:", nextStart)
    console.log("tempWords:", tempWords)
    return findBlanks(grid, tempWords, nextStart)
}

function appendLetters(grid, xBlankLength, yBlankLength, x, y, xMatch, yMatch) {
    //append letters to the nums/blanks
    let tempX = x;
    let tempY = y;
    let wordInd = 0;

    if (xBlankLength > 0) {
        for (let _; tempX < x + xBlankLength; tempX++) {
            if (/* (grid[tempY][tempX][1] !== xMatch[wordInd]) ||  */grid[tempY][tempX].length === 1) {
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
            if (/* !(wordInd === 0 && xBlankLength > 0) && grid[tempY][tempX][1] !== xMatch[wordInd] ||  */grid[tempY][tempX].length === 1) {
                grid[tempY][tempX] += yMatch[wordInd];
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
        if (canFit(word, grid, x, y, direction)) {
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

//console.log(crosswordSolver(puzzle1, words1));
console.log(crosswordSolver(puzzle2, words2));

//export to test
module.exports = { crosswordSolver };
