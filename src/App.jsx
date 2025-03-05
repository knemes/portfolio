import React, { useState} from 'react';
import DrawPalette from './components/Button/DrawPalette';
import Layout from './components/Layout';
import './App.css'
import './fonts.css'

function App() {
    console.log("About To Render");
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentDrawColor, setDrawColor] = useState('black');
    const [lines, setLines] = useState([]);
    const [backgroundLines, setBackgroundLines] = useState([]);
    const [selectedBrush, setSelectedBrush] = useState('Pencil');
    const [eraserEnabled, setEraserEnabled] = useState(false);

    const handleBrushSelection = (brush) => {
        setSelectedBrush(brush);
    };

    const handleColorChange = (color) => {
        setDrawColor(color);
    };

    const handleEraser = () => {
        setEraserEnabled(!eraserEnabled);
    };

    const handleSave = () => {
        // Implement save logic here
    };

    const handleTrash = () => {
        setLines([]);
        setBackgroundLines([]);
    };

    return (
        <div>
            <div className="background-overlay"></div>
            <Layout
                isDrawing={isDrawing}
                setIsDrawing={setIsDrawing}
                lines={lines}
                setLines={setLines}
                backgroundLines={backgroundLines}
                setBackgroundLines={setBackgroundLines}
                selectedBrush={selectedBrush}
                onBrushSelection={handleBrushSelection}
                currentColor={currentDrawColor}
                setDrawColor={setDrawColor}
                eraserEnabled={eraserEnabled}
                onToggleEraser={handleEraser}
                onSave={handleSave}
                onTrash={handleTrash}
            />
            <DrawPalette
                isDrawing={isDrawing}
                setIsDrawing={setIsDrawing}
                onBrushSelection={handleBrushSelection}
                onColorChange={handleColorChange}
                onToggleEraser={handleEraser}
                onSave={handleSave}
                onTrash={handleTrash}
            >
            </DrawPalette>
        </div>
    );
}

export default App;