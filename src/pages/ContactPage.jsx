import React from 'react';
import { useOutletContext } from 'react-router-dom';

function Contact() {
    const { pencilColor } = useOutletContext();

    return (
        <div className="page-content layout-main">
            <h1>Contact</h1>
            <p>Reach out to talk</p>
            <p>Current Pencil Color: <span style={{ color: pencilColor }}>{pencilColor}</span></p>
        </div>
    );
}

export default Contact;