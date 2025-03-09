import React, { useState, useRef, useEffect} from 'react';
import DrawPalette from './components/Button/DrawPalette';
import Layout from './components/Layout';
import './App.css'
import './fonts.css'

function App() {
    console.log("About To Render");
    const [isDrawing, setIsDrawing] = useState(false);
    const [saveTrigger, setSaveTrigger] = useState(false);
    const [trashTrigger, setTrashTrigger] = useState(false);
    const DrawPaletteRef = useRef(null);
    const [previousBrush, setPreviousBrush] = useState("Pencil");
    const [previousColor, setPreviousColor] = useState("black");

    const [drawingState, setDrawingState] = useState({
        selectedBrush: "Pencil",
        currentDrawColor: "black",
        eraserEnabled: false,
    });

    const getDrawingState = () => {
        if (DrawPaletteRef.current) {
            const state = DrawPaletteRef.current.getDrawingState(previousColor, previousBrush);
            return { ...state, trashTrigger };
        }
        return { ...drawingState, trashTrigger };
    };

    const triggerUpdate = () => {
        const newState = getDrawingState();
        setDrawingState(newState);
        setPreviousBrush(newState.selectedBrush);
        setPreviousColor(newState.currentDrawColor);
    };

    return (
        <div>
            <div className="background-overlay"></div>
            <Layout
                isDrawing={isDrawing}
                selectedBrush={drawingState.selectedBrush}
                currentDrawColor={drawingState.currentDrawColor}
                eraserEnabled={drawingState.eraserEnabled}
                saveTrigger={saveTrigger}
                setSaveTrigger={setSaveTrigger}
                trashTrigger={trashTrigger}
                setTrashTrigger={setTrashTrigger}
            />
            <DrawPalette
                ref={DrawPaletteRef}
                isDrawing={isDrawing}
                setIsDrawing={setIsDrawing}
                triggerUpdate={triggerUpdate}
                saveTrigger={saveTrigger}
                setSaveTrigger={setSaveTrigger}
                trashTrigger={trashTrigger}
                setTrashTrigger={setTrashTrigger}
            />
        </div>
    );
}

export default App;