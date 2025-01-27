import React from 'react';
import { useOutletContext } from 'react-router-dom';

function Home() {
    const { pencilColor } = useOutletContext();

    return (
        <div className="page-content layout-main">
            <h1>Home</h1>
            <p>Welcome to the home page!</p>
            <p>Current Pencil Color: <span style={{ color: pencilColor }}>{pencilColor}</span></p>
        </div>
    );
}

export default Home;