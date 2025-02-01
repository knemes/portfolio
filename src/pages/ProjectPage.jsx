import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../fbconfig'; 

function Project() {
    const { pencilColor } = useOutletContext();
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const getImageFromStorage = async () => {
            try {
                // Replace 'path/to/your/image.jpg' with the actual path to your image in Firebase Storage
                const imageRef = ref(storage, 'IMG_3300.png');
                const url = await getDownloadURL(imageRef);
                setImageUrl(url);
            } catch (error) {
                console.error("Error getting image URL:", error);
            }
        };

        getImageFromStorage();
    }, []); 

    return (
        <div className="page-content layout-main">
            <h1>Projects</h1>
            <p>Welcome to my projects</p>
            <p>Current Pencil Color: <span style={{ color: pencilColor }}>{pencilColor}</span></p>
            <div>
                {imageUrl && <img src={imageUrl} alt="Project Image" />}
            </div>
        </div>
    );
}

export default Project;