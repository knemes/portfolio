import { useRef, useEffect, useState, useCallback} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const canvasRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    const drawGrid = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !canvas.getContext) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = window.innerWidth;
        const height = canvas.height = window.innerHeight;

        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        const margin = 100; // Margin around the grid
        const gridWidth = width - 2 * margin;
        const gridHeight = height - 2 * margin;

        // Dynamic grid size calculation (adjust as needed)
        let gridSize = 20; // Example: 10 grid spaces

        const warp = (x, y) => {
            const dx = x - mousePos.x; // Difference in x between grid point and mouse
            const dy = y - mousePos.y; // Difference in y between grid point and mouse
            const dist = Math.sqrt(dx * dx + dy * dy); // Distance between grid point and mouse

            if (dist < 100) { // If mouse is within 100 pixels
                let warpAmount = (100 - dist) / 100 * 10; // Calculate warp amount (stronger closer to mouse)
                return { x: warpAmount * (dx / dist), y: warpAmount * (dy / dist) }; // Return offset
            }
            return { x: 0, y: 0 }; // No warp if mouse is too far away
        };

        // Vertical lines
        for (let xIndex = 0; xIndex <= Math.floor(gridWidth / gridSize); xIndex++) {
            const x = margin + xIndex * gridSize;
            let { x: startWarpX, y: startWarpY } = warp(x, margin);
            let startX = x + startWarpX;
            let startY = margin + startWarpY;

            ctx.beginPath();
            ctx.moveTo(startX, startY);

            for (let yIndex = 0; yIndex <= Math.floor(gridHeight / gridSize); yIndex++) {
                const y = margin + yIndex * gridSize;
                const { x: warpX, y: warpY } = warp(x, y);
                let endX = x + warpX;
                let endY = y + warpY;
                ctx.lineTo(endX, endY);
            }
            ctx.stroke();
        }

        // Horizontal lines (similar adjustments)
        for (let y = margin; y < gridHeight + margin; y += gridSize) {
            let { x: startWarpX, y: startWarpY } = warp(margin, y); // Apply margin to warp
            let startX = margin + startWarpX; // Apply margin
            let startY = y + startWarpY;

            ctx.beginPath();
            ctx.moveTo(startX, startY);

            for (let xIndex = 0; xIndex <= Math.floor(gridWidth / gridSize); xIndex++) { // Adjusted loop
                const x = margin + xIndex * gridSize;
                const { x: warpX, y: warpY } = warp(x, y);
                let endX = x + warpX;
                let endY = y + warpY;
                ctx.lineTo(endX, endY);
            }
            ctx.stroke();
        }
    }, [mousePos]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('resize', drawGrid);
            drawGrid();
        }
        return () => {
            if (canvas) {
                canvas.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('resize', drawGrid);
            }
        };
    }, [drawGrid]);

    return (
    <>
        <div className="container" onMouseMove={handleMouseMove}>
                <canvas ref={canvasRef} className="graph-paper-container" />
        <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        </div>
        <h1>Vite + React</h1>
        <div>
        <p>
            Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        </div>
        <p className="read-the-docs">
        Click on the Vite and React logos to learn more
        </p>
    </>
    )
    }

export default App
