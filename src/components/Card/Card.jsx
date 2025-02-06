import React from 'react';
import { Link } from 'react-router-dom';
import Thumbnail from '../Thumbnail/Thumbnail';
import './Card.css'

const Card = () => {
    return (
        <div className="project-card">
            <div className="image-container">
                <Thumbnail />
            </div>
            <div className="text-container">
                <h3>Project Title</h3>
                <p>Short project description</p>
            </div>
        </div>
    );
};

export default Card;