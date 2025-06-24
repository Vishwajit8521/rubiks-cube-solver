/**
 * Cube class representing a Rubik's Cube
 * 
 * The cube is represented as 6 faces, each with 9 stickers
 * The faces are: Up, Down, Front, Back, Left, Right
 * Colors are represented as: 'r' (red), 'g' (green), 'b' (blue), 'y' (yellow), 'o' (orange), 'w' (white)
 */
class Cube {
    /**
     * Create a new solved Rubik's Cube
     */
    constructor() {
        // Initialize the cube with solved state
        // Each face has 9 stickers of the same color
        this.faces = {
            up: Array(9).fill('w'),     // white
            down: Array(9).fill('y'),    // yellow
            front: Array(9).fill('r'),   // red
            back: Array(9).fill('o'),    // orange
            left: Array(9).fill('g'),    // green
            right: Array(9).fill('b')    // blue
        };
        
        // Store move history
        this.moveHistory = [];
    }
    
    /**
     * Get a string representation of the cube for rendering
     * @returns {string} A string representation of the cube
     */
    toString() {
        // Concatenate all faces in the order: up, right, front, down, left, back
        return (
            this.faces.up.join('') +
            this.faces.right.join('') +
            this.faces.front.join('') +
            this.faces.down.join('') +
            this.faces.left.join('') +
            this.faces.back.join('')
        );
    }
    
    /**
     * Create a deep copy of the cube
     * @returns {Cube} A new cube with the same state
     */
    clone() {
        const newCube = new Cube();
        for (const face in this.faces) {
            newCube.faces[face] = [...this.faces[face]];
        }
        newCube.moveHistory = [...this.moveHistory];
        return newCube;
    }
    
    /**
     * Check if the cube is solved
     * @returns {boolean} True if the cube is solved, false otherwise
     */
    isSolved() {
        // A cube is solved if each face has all stickers of the same color
        for (const face in this.faces) {
            const color = this.faces[face][0];
            if (!this.faces[face].every(c => c === color)) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Rotate a face of the cube clockwise
     * @param {string} face - The face to rotate ('up', 'down', 'front', 'back', 'left', 'right')
     * @param {boolean} [recordMove=true] - Whether to record the move in history
     */
    rotateFace(face, recordMove = true) {
        if (!this.faces[face]) {
            throw new Error(`Invalid face: ${face}`);
        }
        
        // Rotate the stickers on the face itself
        const oldFace = [...this.faces[face]];
        this.faces[face][0] = oldFace[6];
        this.faces[face][1] = oldFace[3];
        this.faces[face][2] = oldFace[0];
        this.faces[face][3] = oldFace[7];
        this.faces[face][4] = oldFace[4]; // Center stays the same
        this.faces[face][5] = oldFace[1];
        this.faces[face][6] = oldFace[8];
        this.faces[face][7] = oldFace[5];
        this.faces[face][8] = oldFace[2];
        
        // Rotate the adjacent faces
        this._rotateAdjacentFaces(face);
        
        // Record the move
        if (recordMove) {
            this.moveHistory.push(face);
        }
    }
    
    /**
     * Rotate a face of the cube counterclockwise
     * @param {string} face - The face to rotate ('up', 'down', 'front', 'back', 'left', 'right')
     * @param {boolean} [recordMove=true] - Whether to record the move in history
     */
    rotateFaceCounterclockwise(face, recordMove = true) {
        // Rotate the face clockwise three times to achieve counterclockwise rotation
        for (let i = 0; i < 3; i++) {
            this.rotateFace(face, false);
        }
        
        // Record the move
        if (recordMove) {
            this.moveHistory.push(`${face}'`);
        }
    }
    
    /**
     * Rotate the adjacent faces when a face is rotated
     * @param {string} face - The face that was rotated
     * @private
     */
    _rotateAdjacentFaces(face) {
        let temp;
        switch (face) {
            case 'up':
                // Save the top row of front
                temp = [this.faces.front[0], this.faces.front[1], this.faces.front[2]];
                
                // front gets from right
                this.faces.front[0] = this.faces.right[0];
                this.faces.front[1] = this.faces.right[1];
                this.faces.front[2] = this.faces.right[2];
                
                // right gets from back
                this.faces.right[0] = this.faces.back[0];
                this.faces.right[1] = this.faces.back[1];
                this.faces.right[2] = this.faces.back[2];
                
                // back gets from left
                this.faces.back[0] = this.faces.left[0];
                this.faces.back[1] = this.faces.left[1];
                this.faces.back[2] = this.faces.left[2];
                
                // left gets from temp (front)
                this.faces.left[0] = temp[0];
                this.faces.left[1] = temp[1];
                this.faces.left[2] = temp[2];
                break;
                
            case 'down':
                // Save the bottom row of front
                temp = [this.faces.front[6], this.faces.front[7], this.faces.front[8]];
                
                // front gets from left
                this.faces.front[6] = this.faces.left[6];
                this.faces.front[7] = this.faces.left[7];
                this.faces.front[8] = this.faces.left[8];
                
                // left gets from back
                this.faces.left[6] = this.faces.back[6];
                this.faces.left[7] = this.faces.back[7];
                this.faces.left[8] = this.faces.back[8];
                
                // back gets from right
                this.faces.back[6] = this.faces.right[6];
                this.faces.back[7] = this.faces.right[7];
                this.faces.back[8] = this.faces.right[8];
                
                // right gets from temp (front)
                this.faces.right[6] = temp[0];
                this.faces.right[7] = temp[1];
                this.faces.right[8] = temp[2];
                break;
                
            case 'front':
                // Save the bottom row of up
                temp = [this.faces.up[6], this.faces.up[7], this.faces.up[8]];
                
                // up gets from left (right column, reversed)
                this.faces.up[6] = this.faces.left[8];
                this.faces.up[7] = this.faces.left[5];
                this.faces.up[8] = this.faces.left[2];
                
                // left gets from down (top row)
                this.faces.left[2] = this.faces.down[0];
                this.faces.left[5] = this.faces.down[1];
                this.faces.left[8] = this.faces.down[2];
                
                // down gets from right (left column, reversed)
                this.faces.down[0] = this.faces.right[6];
                this.faces.down[1] = this.faces.right[3];
                this.faces.down[2] = this.faces.right[0];
                
                // right gets from temp (up)
                this.faces.right[0] = temp[0];
                this.faces.right[3] = temp[1];
                this.faces.right[6] = temp[2];
                break;
                
            case 'back':
                // Save the top row of up
                temp = [this.faces.up[0], this.faces.up[1], this.faces.up[2]];
                
                // up gets from right (right column)
                this.faces.up[0] = this.faces.right[2];
                this.faces.up[1] = this.faces.right[5];
                this.faces.up[2] = this.faces.right[8];
                
                // right gets from down (bottom row, reversed)
                this.faces.right[2] = this.faces.down[8];
                this.faces.right[5] = this.faces.down[7];
                this.faces.right[8] = this.faces.down[6];
                
                // down gets from left (left column)
                this.faces.down[6] = this.faces.left[0];
                this.faces.down[7] = this.faces.left[3];
                this.faces.down[8] = this.faces.left[6];
                
                // left gets from temp (up, reversed)
                this.faces.left[0] = temp[2];
                this.faces.left[3] = temp[1];
                this.faces.left[6] = temp[0];
                break;
                
            case 'left':
                // Save the left column of up
                temp = [this.faces.up[0], this.faces.up[3], this.faces.up[6]];
                
                // up gets from back (right column, reversed)
                this.faces.up[0] = this.faces.back[8];
                this.faces.up[3] = this.faces.back[5];
                this.faces.up[6] = this.faces.back[2];
                
                // back gets from down (left column, reversed)
                this.faces.back[2] = this.faces.down[6];
                this.faces.back[5] = this.faces.down[3];
                this.faces.back[8] = this.faces.down[0];
                
                // down gets from front (left column)
                this.faces.down[0] = this.faces.front[0];
                this.faces.down[3] = this.faces.front[3];
                this.faces.down[6] = this.faces.front[6];
                
                // front gets from temp (up)
                this.faces.front[0] = temp[0];
                this.faces.front[3] = temp[1];
                this.faces.front[6] = temp[2];
                break;
                
            case 'right':
                // Save the right column of up
                temp = [this.faces.up[2], this.faces.up[5], this.faces.up[8]];
                
                // up gets from front (right column)
                this.faces.up[2] = this.faces.front[2];
                this.faces.up[5] = this.faces.front[5];
                this.faces.up[8] = this.faces.front[8];
                
                // front gets from down (right column)
                this.faces.front[2] = this.faces.down[2];
                this.faces.front[5] = this.faces.down[5];
                this.faces.front[8] = this.faces.down[8];
                
                // down gets from back (left column, reversed)
                this.faces.down[2] = this.faces.back[6];
                this.faces.down[5] = this.faces.back[3];
                this.faces.down[8] = this.faces.back[0];
                
                // back gets from temp (up, reversed)
                this.faces.back[0] = temp[2];
                this.faces.back[3] = temp[1];
                this.faces.back[6] = temp[0];
                break;
        }
    }
    
    /**
     * Scramble the cube with random moves
     * @param {number} [numMoves=20] - Number of random moves to make
     */
    scramble(numMoves = 20) {
        const faces = ['up', 'down', 'front', 'back', 'left', 'right'];
        const moves = [];
        
        // Clear move history before scrambling
        this.moveHistory = [];
        
        for (let i = 0; i < numMoves; i++) {
            const face = faces[Math.floor(Math.random() * faces.length)];
            const isClockwise = Math.random() < 0.5;
            
            if (isClockwise) {
                this.rotateFace(face);
                moves.push(face);
            } else {
                this.rotateFaceCounterclockwise(face);
                moves.push(`${face}'`);
            }
        }
        
        return moves;
    }
    
    /**
     * Apply a sequence of moves to the cube
     * @param {string[]} moves - Array of moves to apply
     */
    applyMoves(moves) {
        for (const move of moves) {
            if (move.endsWith("'")) {
                // Counterclockwise move
                const face = move.slice(0, -1);
                this.rotateFaceCounterclockwise(face);
            } else {
                // Clockwise move
                this.rotateFace(move);
            }
        }
    }
}

// Export the Cube class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Cube };
} else {
    window.Cube = Cube;
}