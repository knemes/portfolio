import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../fbconfig'; 
import Card from '../components/Card/Card';
import './ProjectPage.css';

function Project() {

    return (
        <div className="page-content layout-main">
            <div id="proejcts" className="project">
                <h1>Projects</h1>
                <div className="project project-grid">
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </div>
            </div>
        </div>
    );
}

export default Project;