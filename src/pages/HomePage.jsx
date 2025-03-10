import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import HandwrittenLink from '../components/HandwrittenLink/HandwrittenLink';
import './HomePage.css';
import Graph from '../components/Graph/Graph';

function Home({ isDrawing, selectedBrush, currentDrawColor, eraserEnabled, saveTrigger, setSaveTrigger, trashTrigger, setTrashTrigger }) {
    const [hasMounted, setHasMounted] = useState(false);
    const canvasRef = useRef(null);

    const scrollToProjects = () => {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (canvasRef.current) {
            setHasMounted(true);
        }
    }, [canvasRef]);

    return (
        <div className="page-content layout-main">
            <section id="keaton-nemes" className="home">
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
                <HandwrittenLink text="View Projects" href="#projects" onClick={scrollToProjects} />
            </section>
            <canvas ref={canvasRef} />
            {hasMounted && <Graph
                canvas={canvasRef.current}
                isDrawing={isDrawing}
                selectedBrush={selectedBrush}
                currentDrawColor={currentDrawColor}
                eraserEnabled={eraserEnabled}
                saveTrigger={saveTrigger}
                setSaveTrigger={setSaveTrigger}
                trashTrigger={trashTrigger}
                setTrashTrigger={setTrashTrigger}
            />}
        </div>
    );
}

Home.propTypes = {
    isDrawing: PropTypes.bool.isRequired,
    selectedBrush: PropTypes.string.isRequired,
    currentDrawColor: PropTypes.string.isRequired,
    eraserEnabled: PropTypes.bool.isRequired,
    saveTrigger: PropTypes.bool.isRequired,
    setSaveTrigger: PropTypes.func.isRequired,
    trashTrigger: PropTypes.bool.isRequired,
    setTrashTrigger: PropTypes.func.isRequired
};

export default Home;