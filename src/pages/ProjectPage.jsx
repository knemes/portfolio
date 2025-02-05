import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../fbconfig'; 
import Card from '../components/Card/Card';

function Project() {

    return (
        <div className="page-content layout-main">
            <h1>Projects</h1>
            <p>Welcome to my projects</p>
            <div className="project-grid">
                <Card />
                <Card />
            </div>
        </div>
    );
}

export default Project;