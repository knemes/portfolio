import React, { useState } from 'react';
import Graph from './components/Graph/Graph';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/Utils.css';
import './App.css'

function App() {
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
        
    const handleMouseMove = (e) => {
        setMousePos({
            x: e.clientX,
            y: e.clientY
        });
    };

    return (
    <div className="app-container" onMouseMove= {handleMouseMove }>
        <Graph mousePos={mousePos} />
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
    </div>
    
    )
    }

export default App
