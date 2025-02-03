import React from 'react';
import { useOutletContext } from 'react-router-dom';

function About() {

    return (
        <div className="page-content layout-main">
            <h1>About</h1>
            <p>As a computational designer based in Chicago, I'm driven by a passion for exploring the intersection of design,
                technology, and craft. My journey began during my undergraduate studies, where I discovered the power of Grasshopper,
                a visual scripting language that ignited my fascination with algorithmic design and the application of mathematics to architectural form.
            </p>
            <p>My professional experience further solidified this interest. Working as a drafter and Revit modeler, I honed my skills by automating
                workflows through custom scripts and code, recognizing the increasing importance of technology in the design industry. This led me
                to pursue a Master's in Architecture, where I delved deeper into computational design methodologies.
            </p>
            <p>Growing up in the natural landscapes of rural Wisconsin and Montana instilled in me a deep appreciation for the outdoors and a respect
                for the built environment. My childhood, filled with skiing, kayaking, and backpacking, fostered a love for both nature and the
                physical act of creation. This passion is reflected in my woodworking hobby, where I find joy in building functional objects like
                kayaks and cutting boards.
            </p>
            <p>Beyond my professional and creative pursuits, I cherish a balanced lifestyle. I believe in the importance of both screen time and outdoor
                play, and I strive to maintain a healthy dose of both in my life. Music also plays a significant role, and I invite you to explore my
                Spotify account to share in my musical interests.
            </p>
            <p>I am a lifelong learner, always eager to expand my knowledge and explore new creative avenues. I believe in the power of design to positively
                impact the world, and I am dedicated to contributing my skills and creativity to build a brighter future.
            </p>
        </div>
    );
}

export default About;