import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ButtonExpander from './components/Button/ButtonExpander';
import Layout from './components/Layout';
import Home from './pages/HomePage';
import About from './pages/AboutPage';
import Project from './pages/ProjectPage';
import Contact from './pages/ContactPage';
import './App.css'
import './fonts.css'

function App() {
    const [isDrawing, setIsDrawing] = useState(false);
    const [pencilColor, setPencilColor] = useState('black');
    const [lines, setLines] = useState([]);
    const [backgroundLines, setBackgroundLines] = useState([]);

    const clearCanvas = () => {
        setLines([]);
        setBackgroundLines([]);
    };

    return (
        <div>
            <div className="background-overlay"></div>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout
                        isDrawing={isDrawing}
                        setIsDrawing={setIsDrawing}
                        pencilColor={pencilColor}
                        setPencilColor={setPencilColor}
                        lines={lines}
                        setLines={setLines}
                        backgroundLines={backgroundLines}
                        setBackgroundLines={setBackgroundLines}
                        clearCanvas={clearCanvas}
                    />}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="project" element={<Project />} />
                        <Route path="contact" element={<Contact />} />
                    </Route>
                </Routes>
                <ButtonExpander
                    isDrawing={isDrawing}
                    setIsDrawing={setIsDrawing}
                    toggleLabel={isDrawing ? "Stop Drawing" : "Start Drawing"}
                    collapseLabel="Close"
                >
                    <button onClick={() => setPencilColor('red')} style={{ backgroundColor: 'red' }}>Red</button>
                    <button onClick={() => setPencilColor('blue')} style={{ backgroundColor: 'blue' }}>Blue</button>
                    <button onClick={() => setPencilColor('green')} style={{ backgroundColor: 'green' }}>Green</button>
                    <button onClick={clearCanvas}>Clear Canvas</button>
                </ButtonExpander>
            </Router>
        </div>
    );
}

export default App;