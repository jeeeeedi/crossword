function crosswordSolver(puzzle, words) {

    //if number is not 0, that is a starting point.
    //indexN: need to count how many words have the same first letter.
    //number != 0 look for a match with indexN
    //if you encounter another nonzero, check if that letter could be a starting letter, and check if it has the right qty
    //if not, go back and try another; if you cant find others, error
    //

    let nonzeroes = getNonzeroes(puzzle);

    if (isNotEmpty(puzzle) && isNotEmpty(words) &&
        isPuzzleCharsOk(puzzle) && isWordsCharsOk(words) &&
        sumNonzeroes(nonzeroes) === words.length &&
        hasNoDupes(words) &&
        isTwoOrLess(nonzeroes)) {
        stringToTwoDArray(puzzle);
        return solve(puzzle, words);
    } else {
        //return new Error();
        return "Error";
    }

}


//errors:
//ok look for numbers not 0, if the total is not eq to the number of words, then error
//ok no repeated words
//ok puzzle != ''
//ok puzzle should contain only numbers, '.', '\n'
//ok word should be an array of strings containing only letters
//unique solution?

function isNotEmpty(x) {
    if (x.length === 0) {
        return false;
    }
    return true;
}

function isPuzzleCharsOk(puzzle) {
    let regex = /[(0-9)(.)(\n)]+/g;
    for (let i = 0; i < puzzle.length; i++) {
        if (!puzzle[i].match(regex)) {
            return false;
        }
    }
    return true;
}

function isWordsCharsOk(words) {
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
    let nonzeroes = puzzle.toString().match(regex);
    if (!nonzeroes) return 0; // Handle null case
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

function stringToTwoDArray(puzzle) {
    let twoD = puzzle.split("\n").map(line => line.split(""));
    //console.log(twoD)
    return twoD;
}


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


const puzzle = `2001
0..0
1000
0..0`
const words = ['casa', 'alan', 'ciao', 'anta']

/* output:
`casa
i..l
anta
o..n`
*/

console.log(crosswordSolver(puzzle, words));

module.exports = { crosswordSolver/* , getNonzeroes, sumNonzeroes, isTwoOrLess, hasNoDupes  */ };
