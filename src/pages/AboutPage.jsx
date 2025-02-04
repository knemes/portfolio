import React from 'react';
import { useOutletContext } from 'react-router-dom';
import './AboutPage.css';

function About() {

    return (
        <div className="page-content layout-main">
            <section id="about">
                <h1>About Me</h1>
                <p>Growing up amidst the stunning landscapes of Frank Lloyd Wright's rural Wisconsin and the vast prairies of central Montana fostered
                    a deep appreciation for both the natural world and the built environment. Experiences like skiing, kayaking, and backpacking instilled
                    a love for the outdoors and a respect for the interplay between human creation and the natural world. This early exposure nurtured a
                    broad interest in design, encompassing architecture, landscape, and the arts.
                </p>
                <p>I pursued a Bachelor's degree in Mathematics and Design, developing a strong foundation in analytical thinking, creative problem-solving,
                    and the application of rigorous methodologies to design challenges. Upon graduating, I embarked on a journey of exploration, seeking to
                    find the intersection between my love of mathematics and my passion for creative expression. This led to the discovery of computational
                    design tools, opening up new avenues for applying algorithmic thinking and digital technologies to the design process.
                </p>
                <p>During my graduate studies in architecture, I deepened my understanding of architectural principles while simultaneously recognizing the
                    broader potential of computational design methodologies beyond the field of architecture. I began to explore the diverse applications of
                    these tools, from automating workflows and creating data visualizations to conducting structural simulations and investigating the potential
                    of automated manufacturing.
                </p>
                <p>I am continuously seeking innovative ways to apply algorithmic thinking and digital tools to the built environment, and I am driven by a passion for
                    pushing the boundaries of creativity and efficiency in design.
                </p>
                <p>"Do your work, and I shall know you. Do your work, and you shall reinforce yourself." - Emerson</p>
                <a href="/projects" className="button">Projects</a>
            </section>
        </div>
    );
}

export default About;