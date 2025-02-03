import React from 'react';
import { useOutletContext } from 'react-router-dom';
import './HomePage.css';

function Home() {

    return (
        <div className="page-content layout-main">
            <section id="home">
                <h1>Welcome to my online sketchbook.</h1>
                <p>
                    I'm a <b>computational designer</b>, <b>creative coder</b>, and aspiring <b>woodworker</b> passionate about the
                    intersection of <b>design</b> and <b>mathematics</b>. Driven by a love of
                    <b> learning</b> and <b>building</b> new things, I explore the interplay of
                    <b> creativity</b>, <b>technology</b>, and <b>craft</b>.
                </p>
                <p>
                    Here, you'll find a collection of my work, from
                    <b> computational explorations</b> to <b>creative coding projects</b>.
                    Feel free to <b>sketch</b> or annotate anywhere using the draw palette in the right corner.
                    Any sketching you do can be saved and shared - I'm eager to see your <b>perspective</b>!
                </p>
                <p>
                    I believe in a <b>rigorous</b>, <b>fast-footed</b> approach to
                    <b>problem-solving</b>, and I hope this sketchbook provides valuable
                    insights into my <b>design philosophy</b>.
                </p>
                <a href="/about" className="button">Learn More</a>
            </section>
        </div>
    );
}

export default Home;