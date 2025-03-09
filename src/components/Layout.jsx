import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import Graph from './Graph/Graph';
import './Layout.css';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Home from '../pages/HomePage'; // Import your page components
import About from '../pages/AboutPage';
import Project from '../pages/ProjectPage';
import Contact from '../pages/ContactPage';

function Layout({ isDrawing, lines, setLines, backgroundLines, setBackgroundLines, selectedBrush, currentDrawColor, eraserEnabled, saveTrigger, setSaveTrigger, trashTrigger, setTrashTrigger }) {
    const [hasMounted, setHasMounted] = useState(false);
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth - 200);
    const [canvasHeight, setCanvasHeight] = useState(window.innerHeight - 200);
    const canvasRef = useRef(null);
    const mainContainerRef = useRef(null);
    const navLinksRef = useRef(null);
    const sectionWidthRef = useRef(window.innerWidth);
    const [totalPages, setTotalPages] = useState(0);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const projectSectionRef = useRef(null);
    const [scrollCount, setScrollCount] = useState(0);

    const updateCurrentSectionIndex = (sectionIndex) => {
        setCurrentSectionIndex(sectionIndex);
    };

    useEffect(() => {
        if (canvasRef.current) {
            setHasMounted(true);
        }
    }, [canvasRef]);

    //handleResize
    useEffect(() => {
        const handleResize = () => {
            setCanvasWidth(window.innerWidth);
            setCanvasHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Crucial: Call handleResize here for initial render

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    //navlinks and observer for scrolling
    useEffect(() => {
        const mainContainer = mainContainerRef.current;
        const navLinksContainer = navLinksRef.current; // Get the container for the links

        if (mainContainer && navLinksContainer) { // Check if refs are available
            const sections = mainContainer.querySelectorAll('.layout-main > section.top-level-section');
            const navLinks = navLinksContainer.querySelectorAll('a'); // Select the <a> links

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const activeSectionId = entry.target.id;

                            navLinks.forEach((link) => link.classList.remove('active'));
                            const activeLink = navLinksContainer.querySelector(`a[href="#${activeSectionId}"]`);
                            if (activeLink) {
                                activeLink.classList.add('active');
                                const sectionIndex = Array.from(sections).findIndex(section => section.id === activeSectionId);
                                if (sectionIndex !== -1) {
                                    updateCurrentSectionIndex(sectionIndex);
                                }
                            }
                        }
                    });
                },
                {
                    threshold: 0.5,
                }
            );

            sections.forEach((section) => observer.observe(section));

            return () => {
                sections.forEach((section) => observer.unobserve(section));
            };
        }
    }, [mainContainerRef, navLinksRef]);

    //Main navigation effect handleWheel for horizontal scrolling and resizing and state updating
    useEffect(() => {
        if (mainContainerRef.current) {
            const mainContainer = mainContainerRef.current;

            const sections = mainContainer.querySelectorAll('.layout-main > section.top-level-section');
            const calculatedTotalPages = sections.length;
            setTotalPages(calculatedTotalPages);

            const handleWheel = (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();

                    setScrollCount((prevCount) => prevCount + (e.deltaY > 0 ? 1 : -1));

                    const currentPage = Math.round(mainContainer.scrollLeft / sectionWidthRef.current);
                    const targetPage = currentPage + (e.deltaY > 0 ? 1 : -1);
                    const targetScrollLeft = targetPage * sectionWidthRef.current;

                    // Calculate and update currentSectionIndex AFTER scrollTo
                    //const scrollLeft = mainContainer.scrollLeft;
                    //const sectionIndex = Math.round(scrollLeft / sectionWidthRef.current);
                    //setCurrentSectionIndex(sectionIndex);

                    mainContainer.scrollTo({
                        left: targetScrollLeft,
                        behavior: 'smooth',
                    });

                    requestAnimationFrame(() => {
                        const sectionIndex = Math.min(Math.max(0, targetPage), calculatedTotalPages - 1);
                        setCurrentSectionIndex(sectionIndex);

                        const sections = mainContainer.querySelectorAll('.layout-main > section.top-level-section');
                        if (sections[sectionIndex]) {
                            const sectionId = sections[sectionIndex].id;
                            window.history.pushState(null, '', `#${sectionId}`);
                            window.dispatchEvent(new HashChangeEvent('hashchange'));
                        }
                    });

                    setScrollCount(0); 

                    if (mainContainerRef.current) {
                        const sections = mainContainerRef.current.querySelectorAll('.layout-main > section.top-level-section');
                        if (sections[currentSectionIndex]) {
                            const sectionId = sections[currentSectionIndex].id;
                            window.history.replaceState(null, '', `#${sectionId}`);
                        }
                    }
                }
            };

            const scrollToCurrentSection = () => {
                const scrollLeft = mainContainer.scrollLeft;
                const sectionIndex = Math.round(scrollLeft / sectionWidthRef.current);
                const targetScrollLeft = sectionIndex * sectionWidthRef.current;

                mainContainer.scrollTo({
                    left: targetScrollLeft,
                    behavior: 'smooth',
                });       
                
                requestAnimationFrame(() => {
                    setCurrentSectionIndex(sectionIndex);
                    const sections = mainContainer.querySelectorAll('.layout-main > section.top-level-section');
                    if (sections[sectionIndex]) {
                        const sectionId = sections[sectionIndex].id;
                        window.history.pushState(null, '', `#${sectionId}`);
                        window.dispatchEvent(new HashChangeEvent('hashchange'));
                    }
                });

            };

            const handleResize = () => {
                sectionWidthRef.current = window.innerWidth; // Update sectionWidth
                scrollToCurrentSection();
            };

            const handlePopstate = () => {
                const hash = window.location.hash;
                if (hash) {
                    const sectionId = hash.replace('#', '');
                    const targetSection = mainContainerRef.current.querySelector(`#${sectionId}`);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });

                        const sections = mainContainerRef.current.querySelectorAll('.layout-main > section.top-level-section');
                        const sectionIndex = Array.from(sections).findIndex(section => section.id === sectionId);
                        if (sectionIndex >= 0) {
                            setCurrentSectionIndex(sectionIndex);
                            mainContainerRef.current.scrollTo({
                                left: sectionIndex * sectionWidthRef.current,
                                behavior: 'smooth',
                            })
                        }
                    }
                }
            };

            window.addEventListener('popstate', handlePopstate);
            window.addEventListener('resize', handleResize);
            mainContainer.addEventListener('wheel', handleWheel);

            if (sections[currentSectionIndex]) {
                const sectionId = sections[currentSectionIndex].id;
                window.history.replaceState(null, '', `#${sectionId}`);
            }

            return () => {
                mainContainer.removeEventListener('wheel', handleWheel);
                window.removeEventListener('popstate', handlePopstate);
            };
        }
    }, [mainContainerRef]);

    //setTotalPages
    useEffect(() => {
        if (mainContainerRef.current) {
            const sections = mainContainerRef.current.querySelectorAll('.layout-main > section.top-level-section');
            setTotalPages(sections.length);
        }
    }, [mainContainerRef]);

    return (
        <div className='layout-container'> {/* Flexbox for layout */}
            <Header ref={navLinksRef} mainContainerRef={mainContainerRef} />
            <div className="canvas-container" >
                <canvas
                    ref={canvasRef}
                />
                {hasMounted && <Graph
                    canvas={canvasRef.current}
                    isDrawing={isDrawing}
                    lines={lines}
                    setLines={setLines}
                    backgroundLines={backgroundLines}
                    setBackgroundLines={setBackgroundLines}
                    selectedBrush={selectedBrush}
                    currentDrawColor={currentDrawColor}
                    eraserEnabled={eraserEnabled}
                    saveTrigger={saveTrigger}
                    setSaveTrigger={setSaveTrigger}
                    trashTrigger={trashTrigger}
                    setTrashTrigger={setTrashTrigger}
                    />}
            </div>
            <div className="layout-main" ref={mainContainerRef} >
                <section id="keaton-nemes" className="top-level-section" > <div className="page-content"> <Home /> </div> </section>
                <section id="projects" className="top-level-section" ref={projectSectionRef}> <div className="page-content">
                    <Project isDrawing={isDrawing}
                    lines={lines}
                    setLines={setLines}
                    backgroundLines={backgroundLines}
                    setBackgroundLines={setBackgroundLines}
                    selectedBrush={selectedBrush}
                    currentDrawColor={currentDrawColor}
                    eraserEnabled={eraserEnabled}
                    saveTriggered={saveTrigger}
                        trashTriggered={trashTrigger}
                    /> </div> </section>
                <section id="about" className="top-level-section"> <div className="page-content">
                    <About isDrawing={isDrawing}
                    lines={lines}
                    setLines={setLines}
                    backgroundLines={backgroundLines}
                    setBackgroundLines={setBackgroundLines}
                    selectedBrush={selectedBrush}
                    currentDrawColor={currentDrawColor}
                    eraserEnabled={eraserEnabled}
                    saveTriggered={saveTrigger}
                        trashTriggered={trashTrigger}
                    /> </div> </section>
                <section id="contact" className="top-level-section"> <div className="page-content">
                    <Contact isDrawing={isDrawing}
                    lines={lines}
                    setLines={setLines}
                    backgroundLines={backgroundLines}
                    setBackgroundLines={setBackgroundLines}
                    selectedBrush={selectedBrush}
                    currentDrawColor={currentDrawColor}
                    eraserEnabled={eraserEnabled}
                    saveTriggered={saveTrigger}
                        trashTriggered={trashTrigger}
                    /> </div> </section>
            </div>
            <Footer currentPage={currentSectionIndex + 1} totalPages={totalPages} />
        </div>
    );
}

Layout.propTypes = {
    isDrawing: PropTypes.bool.isRequired,
    lines: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        color: PropTypes.string
    })).isRequired,
    setLines: PropTypes.func.isRequired,
    backgroundLines: PropTypes.arrayOf(
        PropTypes.arrayOf( // Array of lines
            PropTypes.shape({ // Each line is an array of points
                x: PropTypes.number.isRequired,
                y: PropTypes.number.isRequired,
                color: PropTypes.string,
            })
        )
    ).isRequired,
    setBackgroundLines: PropTypes.func.isRequired,
    selectedBrush: PropTypes.string.isRequired,
    currentDrawColor: PropTypes.string.isRequired,
    eraserEnabled: PropTypes.bool.isRequired,
    saveTrigger: PropTypes.bool.isRequired,
    setSaveTrigger: PropTypes.bool.isRequired,
    trashTrigger: PropTypes.bool.isRequired,
    setTrashTrigger: PropTypes.bool.isRequired
};

export default Layout;