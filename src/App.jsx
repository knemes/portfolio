import { useRef, useEffect, useState } from 'react'
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

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx || !canvas) return;

        const width = canvas.width = window.innerWidth;
        const height = canvas.height = window.innerHeight;

        const drawGrid = () => {
            ctx.clearRect(0, 0, width, height);

            const gridSize = 20;

            //ctx.strokeStyle = '#eee';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;

            const usableWidth = width - 40;
            const usableHeight = height - 40;

            const numHorizontalLines = Math.floor(usableWidth / gridSize);
            const actualHorizontalGridSize = usableWidth / numHorizontalLines;

            const numVerticalLines = Math.floor(usableHeight / gridSize);
            const actualVerticalGridSize = usableHeight / numVerticalLines;

            const warp = (x, y) => {
                const dx = x - mousePos.x;
                const dy = y - mousePos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    let warpAmount = (100 - dist) / 100 * 10;
                    return { x: warpAmount * (dx / dist), y: warpAmount * (dy / dist) };
                }
                return { x: 0, y: 0 };
            };

            for (let x = 0; x <= width; x += actualHorizontalGridSize) {
                ctx.beginPath();
                let { x: startWarpX, y: startWarpY } = warp(x, 0);
                ctx.moveTo(x + startWarpX, 0 + startWarpY);
                for (let y = 5; y < height; y += 5) {
                    const { x: warpX, y: warpY } = warp(x, y);
                    ctx.lineTo(x + warpX, y + warpY);
                }
                ctx.stroke();
            }

            for (let y = 0; y <= height; y += actualVerticalGridSize) {
                ctx.beginPath();
                let { x: startWarpX, y: startWarpY } = warp(0, y);
                ctx.moveTo(0 + startWarpX, y + startWarpY);
                for (let x = 5; x < width; x += 5) {
                    const { x: warpX, y: warpY } = warp(x, y);
                    ctx.lineTo(x + warpX, y + warpY);
                }
                ctx.stroke();
            }

            ctx.lineWidth = 1;
            ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
        };

        drawGrid();

        window.addEventListener('resize', drawGrid);

        return () => {
            window.removeEventListener('resize', drawGrid);
        };
    }, [mousePos]);

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
