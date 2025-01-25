import React from 'react';
import './TestComponent.css';

function TestComponent() {
    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}> {/* Important: Full viewport and relative positioning */}
            {/* Place your component to test here */}
        </div>
    );
}

export default TestComponent;