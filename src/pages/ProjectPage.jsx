import React from 'react';
import { useOutletContext } from 'react-router-dom';

function Project() {
    const { pencilColor } = useOutletContext();

    return (
        <div className="page-content layout-main">
            <h1>Projects</h1>
            <p>Welcome to my projects</p>
            <p>Current Pencil Color: <span style={{ color: pencilColor }}>{pencilColor}</span></p>
        </div>
    );
}

export default Project;