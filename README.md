# Crossword Solver 🧩

## Description 🔍

`crosswordSolver` is a function that fills an empty crossword puzzle with a given list of words while following specific constraints. If the puzzle cannot be uniquely solved or if any of the input conditions are not met, the function outputs an error message.

## Prerequisites 🛠️

Before using this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Things to Download 📂

- Clone or download this repository to your local machine.
- Install dependencies by running:

  ```sh
  npm install
  ```

## Usage 🔡

The function must be implemented in a file named `crosswordSolver.js` and takes two arguments:

1. **`puzzle`:** A string representing the crossword puzzle grid. Each character in the string follows these rules:
   - A **number** (`0-9`) represents how many words start at that position.
   - A `.` represents a space that does not need to be filled.
   - A `\n` represents a newline, separating rows of the grid.
2. **`words`:** An array of words to be placed in the puzzle. No duplicate words are allowed.

## Expected Output 📤

The function should print the solved crossword puzzle to the console. If the input conditions are not met or the puzzle does not have a unique solution, the function prints `'Error'`.

## Example 🧩

```javascript
const emptyPuzzle = `2001\n0..0\n1000\n0..0`;
const words = ['casa', 'alan', 'ciao', 'anta'];

crosswordSolver(emptyPuzzle, words);
```

### Expected Output

```
casa
i..l
anta
o..n
```

## Edge Cases 🛑

- The function should handle cases where:
  - The input puzzle cannot be uniquely solved.
  - There are insufficient words to fill the puzzle.
  - The given words do not fit within the given constraints.
  - The puzzle structure is invalid.

## Requirements 📝

- The function **must** print the solution directly to the console.
- The puzzle must be uniquely solvable; otherwise, it should return `'Error'`.
- Only valid words from the provided list should be used.

## Implementation Details ⚙️

- Ensure that the function correctly parses the puzzle format.
- Use an efficient algorithm to fill the crossword while adhering to constraints.
- Implement proper error handling for invalid inputs.

## Running Tests ✅

This project uses [Mocha](https://mochajs.org/) for testing. Here's how to run the test:

1. Install Mocha if not already installed:

   ```sh
   npm install --save-dev mocha
   ```

2. Ensure the test file is inside the `test` folder: `test/crosswordSolver.test.js`.

3. Run the test:

   ```sh
   npx mocha
   ```

## Members

* [Johannes Sundbäck 😎](https://github.com/JSundb)
* [Jedi Reston 🤓](https://github.com/jeeeeedi)

This project is created as part of the grit:lab JavaScript Piscine raid.