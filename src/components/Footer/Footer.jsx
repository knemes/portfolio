import React from 'react';
import ButtonExpander from '../Button/ButtonExpander';
import './Footer.css'; 

function Footer({ isDrawing, setIsDrawing, setPencilColor, clearCanvas } ) {
    return (
        <footer className="footer"> {/* Apply the layout-footer class here */}
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} My Awesome App</p>
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
            </div>
        </footer>
    );
}

export default Footer;