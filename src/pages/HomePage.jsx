import React from 'react';
import { useOutletContext } from 'react-router-dom';

function Home() {
    const { isDrawing, toggleDrawingMode, setDrawingColor, clearCanvas, pencilColor } = useOutletContext();

    return (
        <div>
            <h1>Home</h1>
            <p>Welcome to the home page!</p>
            <button onClick={toggleDrawingMode}>
                {isDrawing ? "Stop Drawing" : "Start Drawing"}
            </button>
            <button onClick={() => setDrawingColor('red')} style={{ backgroundColor: 'red' }}>Red</button>
            <button onClick={() => setDrawingColor('blue')} style={{ backgroundColor: 'blue' }}>Blue</button>
            <button onClick={() => setDrawingColor('green')} style={{ backgroundColor: 'green' }}>Green</button>
            <button onClick={clearCanvas}>Clear Canvas</button>
            <p>Current Pencil Color: <span style={{ color: pencilColor }}>{pencilColor}</span></p>
        </div>
    );
}

export default Home;