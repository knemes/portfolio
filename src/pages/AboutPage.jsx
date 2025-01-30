import React from 'react';
import { useOutletContext } from 'react-router-dom';

function About() {
    const { pencilColor } = useOutletContext();

    return (
        <div className="page-content layout-main">
            <h1>About</h1>
            <p>I am a computational designer</p>
            <p>Current Pencil Color: <span style={{ color: pencilColor }}>{pencilColor}</span></p>
        </div>
    );
}

export default About;