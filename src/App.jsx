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
    const [saveTriggered, setSaveTriggered] = useState(false);
    const [trashTriggered, setTrashTriggered] = useState(false);

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
        setSaveTriggered(true);
    };

    const handleTrash = () => {
        setTrashTriggered(true);
    };

    return (
        <div>
            <div className="background-overlay"></div>
            <Layout
                isDrawing={isDrawing}
                lines={lines}
                setLines={setLines}
                backgroundLines={backgroundLines}
                setBackgroundLines={setBackgroundLines}
                selectedBrush={selectedBrush}
                currentDrawColor={currentDrawColor}
                eraserEnabled={eraserEnabled}
                saveTriggered={saveTriggered}
                trashTriggered={trashTriggered}
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