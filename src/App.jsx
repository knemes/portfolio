import React, { useState } from 'react';
import Graph from './components/Graph/Graph';
import DrawButton from './components/Button/DrawButton';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/Utils.css';
import './App.css'
import { useRef } from 'react';

function App() {
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const [isDrawing, setIsDrawing] = useState(false);
    const [lines, setLines] = useState([]);
    const [backgroundLines, setBackgroundLines] = useState([]);
    const [pencilColor, setPencilColor] = useState('black');
    const isMouseDown = useRef(false);

    const handleMouseDown = (e) => {
        if (isDrawing) {
            isMouseDown.current = true;
            setLines([[{ x: e.clientX, y: e.clientY, color: pencilColor, originalColor: pencilColor }]]);
        }
    }

    const handleMouseUp = () => {
        if (isDrawing) {
            isMouseDown.current = false;
            if (lines.length > 0 && lines[0].length > 0) { // check if there is a line to add
                setBackgroundLines(prevBackgroundLines => [...prevBackgroundLines, lines[0]]);
            }
            setLines([]); // Clear current line
        }
    }

    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
        if (isDrawing && isMouseDown.current) {
            setLines(prevLines => {
                if (prevLines.length === 0) {
                    return [[{ x: e.clientX, y: e.clientY, color: pencilColor, originalColor: pencilColor }]]
                }
                const lastLine = prevLines[prevLines.length - 1];
                return [...prevLines.slice(0, -1), [...lastLine, { x: e.clientX, y: e.clientY, color: pencilColor, originalColor: pencilColor }]];
            });
        }
    };

    const toggleDrawingMode = () => {
        setIsDrawing(!isDrawing);
        if (isDrawing) { // Fading
            setBackgroundLines(prevBackgroundLines =>
                prevBackgroundLines.map(line =>
                    line.map(point => ({ ...point, color: 'rgba(0,0,0,0.1)' })) // Create NEW point objects
                )
            );
            setLines([]);
        } else { // Restoring
            setBackgroundLines(prevBackgroundLines =>
                prevBackgroundLines.map(line => {
                    const originalColor = line[0].originalColor || 'black';
                    return line.map(point => ({ ...point, color: originalColor })); // Create NEW point objects
                })
            );
        }
    };

    const clearCanvas = () => {
        setLines([]);
        setBackgroundLines([]);
    };

    const setDrawingColor = (color) => {
        setPencilColor(color);
    };

    return (
        <div className={`app-container ${isDrawing ? 'drawing-mode' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <Graph mousePos={mousePos} isDrawing={isDrawing} lines={lines} backgroundLines={backgroundLines} />
            <div className="content-container flex-column items-center">
                <div className="logo-container flex-row items-center">
                    <a href="https://vite.dev" target="_blank">
                        <img src={viteLogo} className="logo" alt="Vite logo" />
                    </a>
                    <a href="https://react.dev" target="_blank">
                        <img src={reactLogo} className="logo react" alt="React logo" />
                        </a>
                </div>
                <div className="text-container flex-column items-center">
                    <h1>Vite + React</h1>
                    <p>
                        Edit <code>src/App.jsx</code> and save to test HMR
                    </p>
                    <p className="read-the-docs">
                    Click on the Vite and React logos to learn more
                    </p>
                </div>
            </div>
            <div>
                <DrawButton 
                    isDrawing={isDrawing}
                    toggleDrawingMode={toggleDrawingMode}
                    setDrawingColor={setDrawingColor}
                    clearCanvas={clearCanvas}
                />
            </div>
        </div>
    
    )
    }

export default App
