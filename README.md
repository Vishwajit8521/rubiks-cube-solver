# Rubik's Cube Solver

This project implements a Rubik's Cube solver in JavaScript. It provides a visual representation of the cube, allows manual rotation of the faces, and includes an algorithm to solve any scrambled cube.

## Features

- Object-oriented representation of a Rubik's Cube
- Manual rotation of cube faces (clockwise and counterclockwise)
- Random scrambling of the cube
- Layer-by-layer solving algorithm
- Visual representation of the cube and solution steps

## Project Structure

- `index.html`: The main HTML file that loads the JavaScript files
- `js/cube.js`: Contains the `Cube` class that represents a Rubik's Cube
- `js/solver.js`: Contains the `Solver` class that implements the solving algorithm
- `js/main.js`: Contains the UI code and connects the Cube and Solver classes

## How to Run

Simply open the `index.html` file in a web browser. No server or build process is required.

## Implementation Details

### Cube Representation

The cube is represented as 6 faces (up, down, front, back, left, right), each with 9 stickers. The colors are represented as single characters: 'r' (red), 'g' (green), 'b' (blue), 'y' (yellow), 'o' (orange), 'w' (white).

### Rotation

The `Cube` class provides methods to rotate each face clockwise or counterclockwise. When a face is rotated, the stickers on that face and the adjacent faces are updated accordingly.

### Solving Algorithm

The solver uses a layer-by-layer approach, which is a common beginner's method for solving the Rubik's Cube. The steps are:

1. Solve the white cross
2. Solve the white corners
3. Solve the middle layer
4. Solve the yellow cross
5. Solve the yellow edges
6. Solve the yellow corners
7. Orient the yellow corners

Note: The current implementation uses simplified algorithms for demonstration purposes. A complete solver would need more sophisticated logic to handle all possible cube states.

## Visualization

The cube is visualized using SVG, with each sticker represented as a colored square. The solution steps are displayed below the cube, showing the description of each step and the moves performed.

## Future Improvements

- Implement a more sophisticated solving algorithm
- Add animation for cube rotations
- Optimize the solver for fewer moves
- Add support for different cube sizes (2x2, 4x4, etc.)