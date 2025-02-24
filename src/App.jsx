import React, { useState} from 'react';
import ButtonExpander from './components/Button/ButtonExpander';
import Layout from './components/Layout';
import './App.css'
import './fonts.css'

function App() {
    console.log("About To Render");
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
            <Layout
                isDrawing={isDrawing}
                setIsDrawing={setIsDrawing}
                pencilColor={pencilColor}
                setPencilColor={setPencilColor}
                lines={lines}
                setLines={setLines}
                backgroundLines={backgroundLines}
                setBackgroundLines={setBackgroundLines}
                clearCanvas={clearCanvas}
            />
            <ButtonExpander
                isDrawing={isDrawing}
                setIsDrawing={setIsDrawing}
                toggleLabel={isDrawing ? "Stop Drawing" : "Start Drawing"}
                collapseLabel="Close"
            >
            </ButtonExpander>
        </div>
    );
}

export default App;