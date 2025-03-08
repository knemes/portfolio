import React, { useState, useRef, useEffect} from 'react';
import DrawPalette from './components/Button/DrawPalette';
import Layout from './components/Layout';
import './App.css'
import './fonts.css'

function App() {
    console.log("About To Render");
    const [isDrawing, setIsDrawing] = useState(false);
    const [lines, setLines] = useState([]);
    const [backgroundLines, setBackgroundLines] = useState([]);
    const DrawPaletteRef = useRef(null);
    const [trigger, setTrigger] = useState(false);

    const [drawingState, setDrawingState] = useState({
        selectedBrush: "Pencil",
        currentDrawColor: "black",
        eraserEnabled: false,
        saveTriggered: false,
        trashTriggered: false,
    });

    const getDrawingState = () => {
        if (DrawPaletteRef.current) {
            return DrawPaletteRef.current.getDrawingState();
        }
        return drawingState;
    };

    const triggerUpdate = () => {
        setDrawingState(getDrawingState());
    };

    console.log('Eraser Enabled:', drawingState.eraserEnabled);
    return (
        <div>
            <div className="background-overlay"></div>
            <Layout
                isDrawing={isDrawing}
                lines={lines}
                setLines={setLines}
                backgroundLines={backgroundLines}
                setBackgroundLines={setBackgroundLines}
                selectedBrush={drawingState.selectedBrush}
                currentDrawColor={drawingState.currentDrawColor}
                eraserEnabled={drawingState.eraserEnabled}
                saveTriggered={drawingState.saveTriggered}
                trashTriggered={drawingState.trashTriggered}
            />
            <DrawPalette
                ref={DrawPaletteRef}
                isDrawing={isDrawing}
                setIsDrawing={setIsDrawing}
                triggerUpdate={triggerUpdate}
            />
        </div>
    );
}

export default App;