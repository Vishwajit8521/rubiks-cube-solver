/**
 * Main script for the Rubik's Cube Solver application
 * 
 * This script handles the UI and connects the Cube and Solver classes
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create a new cube
    const cube = new Cube();
    
    // Create a new solver
    const solver = new Solver();
    
    // Reference to the solution steps container
    let solutionStepsContainer;
    
    // Initialize the UI
    initUI();
    
    /**
     * Initialize the user interface
     */
    function initUI() {
        // Create the main container
        const container = document.createElement('div');
        container.className = 'container';
        document.body.appendChild(container);
        
        // Create the header
        const header = document.createElement('h1');
        header.textContent = "Rubik's Cube Solver";
        container.appendChild(header);
        
        // Create the cube display
        const cubeDisplay = document.createElement('div');
        cubeDisplay.id = 'cube-display';
        container.appendChild(cubeDisplay);
        
        // Create the controls container
        const controls = document.createElement('div');
        controls.className = 'controls';
        container.appendChild(controls);
        
        // Create the buttons
        const scrambleButton = createButton('Scramble', () => scrambleCube());
        const solveButton = createButton('Solve', () => solveCube());
        const resetButton = createButton('Reset', () => resetCube());
        
        controls.appendChild(scrambleButton);
        controls.appendChild(solveButton);
        controls.appendChild(resetButton);
        
        // Create the manual rotation controls
        const rotationControls = document.createElement('div');
        rotationControls.className = 'rotation-controls';
        container.appendChild(rotationControls);
        
        // Add a heading for the rotation controls
        const rotationHeading = document.createElement('h2');
        rotationHeading.textContent = 'Manual Rotation';
        rotationControls.appendChild(rotationHeading);
        
        // Create buttons for each face rotation
        const faces = ['up', 'down', 'front', 'back', 'left', 'right'];
        
        for (const face of faces) {
            const faceControls = document.createElement('div');
            faceControls.className = 'face-controls';
            
            const faceLabel = document.createElement('span');
            faceLabel.textContent = face.charAt(0).toUpperCase() + face.slice(1) + ':';
            faceControls.appendChild(faceLabel);
            
            const clockwiseButton = createButton('↻', () => rotateFace(face, true));
            const counterClockwiseButton = createButton('↺', () => rotateFace(face, false));
            
            faceControls.appendChild(clockwiseButton);
            faceControls.appendChild(counterClockwiseButton);
            
            rotationControls.appendChild(faceControls);
        }
        
        // Create the solution steps container
        solutionStepsContainer = document.createElement('div');
        solutionStepsContainer.className = 'solution-steps';
        solutionStepsContainer.innerHTML = '<h2>Solution Steps</h2>';
        container.appendChild(solutionStepsContainer);
        
        // Add some basic CSS
        addStyles();
        
        // Initial render of the cube
        renderCube();
    }
    
    /**
     * Create a button element with text and click handler
     * @param {string} text - The button text
     * @param {Function} onClick - The click handler
     * @returns {HTMLButtonElement} The button element
     */
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }
    
    /**
     * Add any dynamic styles or initialize style-related functionality
     */
    function addStyles() {
        // Styles are now in external CSS file
        // This function is kept for potential future dynamic styling needs
    }
    
    /**
     * Render the cube in the UI with animation
     */
    function renderCube() {
        const cubeDisplay = document.getElementById('cube-display');
        
        // Add animation class
        cubeDisplay.classList.add('cube-update');
        
        // Get the string representation of the cube
        const cubeString = cube.toString();
        
        // Always use the SVG representation
        cubeDisplay.innerHTML = getCubeSvg(cubeString);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            cubeDisplay.classList.remove('cube-update');
        }, 300);
    }
    
    /**
     * Scramble the cube with visual feedback
     */
    function scrambleCube() {
        const scrambleBtn = document.querySelector('.controls button:nth-child(1)');
        scrambleBtn.classList.add('active-action');
        
        // Add loading effect
        document.getElementById('cube-display').classList.add('loading');
        
        // Use setTimeout to create a visual delay
        setTimeout(() => {
            cube.scramble(20);
            renderCube();
            clearSolutionSteps();
            
            // Remove loading and button effects
            document.getElementById('cube-display').classList.remove('loading');
            scrambleBtn.classList.remove('active-action');
        }, 400);
    }
    
    /**
     * Solve the cube
     */
    function solveCube() {
        // Solve the cube
        const solution = solver.solve(cube);
        
        // Clear previous solution steps
        solutionStepsContainer.innerHTML = '<h2>Solution Steps</h2>';
        
        // Display each step of the solution
        for (const step of solution.steps) {
            const stepElement = document.createElement('div');
            stepElement.className = 'step';
            stepElement.innerHTML = `
                <div class="step-description">${step.description}</div>
                <div class="step-moves">${formatMoves(step.moves)}</div>
            `;
            solutionStepsContainer.appendChild(stepElement);
        }
        
        // Apply the solution to the cube
        cube.applyMoves(solution.moves);
        
        // Render the solved cube
        renderCube();
    }
    
    /**
     * Reset the cube to its solved state
     */
    function resetCube() {
        // Create a new solved cube
        const newCube = new Cube();
        
        // Copy the state to the current cube
        for (const face in newCube.faces) {
            cube.faces[face] = [...newCube.faces[face]];
        }
        
        // Clear the move history
        cube.moveHistory = [];
        
        // Clear the solution steps
        solutionStepsContainer.innerHTML = '<h2>Solution Steps</h2>';
        
        // Render the reset cube
        renderCube();
    }
    
    /**
     * Rotate a face of the cube
     * @param {string} face - The face to rotate
     * @param {boolean} clockwise - Whether to rotate clockwise
     */
    function rotateFace(face, clockwise) {
        if (clockwise) {
            cube.rotateFace(face);
        } else {
            cube.rotateFaceCounterclockwise(face);
        }
        
        // Render the updated cube
        renderCube();
    }
    
    /**
     * Format moves for display
     * @param {string[]} moves - The moves to format
     * @returns {string} Formatted moves string
     */
    function formatMoves(moves) {
        if (!moves || moves.length === 0) {
            return 'No moves';
        }
        
        return moves.join(', ');
    }
});

/**
 * This function is assumed to be provided externally
 * It should take a string representation of the cube and return an SVG
 * @param {string} cubeString - The string representation of the cube
 * @returns {string} SVG representation of the cube
 */
function getCubeSvg(cubeString) {
    // This is a placeholder implementation
    // The actual implementation should be provided as mentioned in the task description
    
    // For now, we'll create a simple colored grid representation
    const colors = {
        'r': '#FF0000', // red
        'g': '#00FF00', // green
        'b': '#0000FF', // blue
        'y': '#FFFF00', // yellow
        'o': '#FFA500', // orange
        'w': '#FFFFFF'  // white
    };
    
    let svg = `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">`;
    
    // Split the cube string into faces
    const up = cubeString.substring(0, 9);
    const right = cubeString.substring(9, 18);
    const front = cubeString.substring(18, 27);
    const down = cubeString.substring(27, 36);
    const left = cubeString.substring(36, 45);
    const back = cubeString.substring(45, 54);
    
    // Draw the up face
    for (let i = 0; i < 9; i++) {
        const x = 100 + (i % 3) * 30;
        const y = 10 + Math.floor(i / 3) * 30;
        svg += `<rect x="${x}" y="${y}" width="30" height="30" fill="${colors[up[i]]}" stroke="black" stroke-width="1" />`;
    }
    
    // Draw the front face
    for (let i = 0; i < 9; i++) {
        const x = 100 + (i % 3) * 30;
        const y = 100 + Math.floor(i / 3) * 30;
        svg += `<rect x="${x}" y="${y}" width="30" height="30" fill="${colors[front[i]]}" stroke="black" stroke-width="1" />`;
    }
    
    // Draw the right face
    for (let i = 0; i < 9; i++) {
        const x = 190 + (i % 3) * 30;
        const y = 100 + Math.floor(i / 3) * 30;
        svg += `<rect x="${x}" y="${y}" width="30" height="30" fill="${colors[right[i]]}" stroke="black" stroke-width="1" />`;
    }
    
    // Draw the left face
    for (let i = 0; i < 9; i++) {
        const x = 10 + (i % 3) * 30;
        const y = 100 + Math.floor(i / 3) * 30;
        svg += `<rect x="${x}" y="${y}" width="30" height="30" fill="${colors[left[i]]}" stroke="black" stroke-width="1" />`;
    }
    
    // Draw the down face
    for (let i = 0; i < 9; i++) {
        const x = 100 + (i % 3) * 30;
        const y = 190 + Math.floor(i / 3) * 30;
        svg += `<rect x="${x}" y="${y}" width="30" height="30" fill="${colors[down[i]]}" stroke="black" stroke-width="1" />`;
    }
    
    // Draw the back face
    for (let i = 0; i < 9; i++) {
        const x = 280 - (i % 3) * 30;
        const y = 280 - Math.floor(i / 3) * 30;
        svg += `<rect x="${x}" y="${y}" width="30" height="30" fill="${colors[back[i]]}" stroke="black" stroke-width="1" />`;
    }
    
    svg += `</svg>`;
    return svg;
}