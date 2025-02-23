import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Graph from './Graph/Graph';
import './Layout.css';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Home from '../pages/HomePage'; // Import your page components
import About from '../pages/AboutPage';
import Project from '../pages/ProjectPage';
import Contact from '../pages/ContactPage';

function Layout({ isDrawing, setIsDrawing, pencilColor, setPencilColor, lines, setLines, backgroundLines, setBackgroundLines, clearCanvas, children }) {
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth - 200);
    const [canvasHeight, setCanvasHeight] = useState(window.innerHeight - 200);
    const [scrollCount, setScrollCount] = useState(0);
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const isMouseDown = useRef(false);
    const canvasRef = useRef(null);
    const mainContainerRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const navLinksRef = useRef(null);
    const sectionWidthRef = useRef(window.innerWidth);
    const [totalPages, setTotalPages] = useState(0);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const projectSectionRef = useRef(null);

    useLayoutEffect(() => {
        const path = location.pathname;
        let sectionId = path.replace("/", "");
        sectionId = sectionId.replace(/[^a-z0-9-_]/g, ""); // Sanitize (important!)

        if (mainContainerRef.current) {
            if (sectionId) { // Check if sectionId is NOT empty
                const targetSection = mainContainerRef.current.querySelector(`#${sectionId}`);
                if (targetSection) {
                    mainContainerRef.current.scrollTo({
                        left: targetSection.offsetLeft,
                        behavior: 'smooth',
                    });
                }
            } else { // Handle empty sectionId (root path)
                const firstSection = mainContainerRef.current.querySelector('section');
                if (firstSection) {
                    mainContainerRef.current.scrollTo({
                        left: 0,
                        behavior: 'smooth',
                    });
                }
            }
        }
    }, [location.pathname, mainContainerRef]);

    const updateCurrentSectionIndex = (sectionIndex) => {
        setCurrentSectionIndex(sectionIndex);
    };

    const [hasMounted, setHasMounted] = useState(false);

    const getCanvasCoords = useCallback((e) => {
        if (!canvasRef.current) return null;
        const rect = canvasRef.current.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }, []);

    const handleMouseDown = useCallback((e) => {
        if (isDrawing) {
            isMouseDown.current = true;
            const coords = getCanvasCoords(e);
            if (coords) {
                setLines([[{ ...coords, color: pencilColor, originalColor: pencilColor }]]);
            }
        }
    }, [isDrawing, pencilColor, getCanvasCoords]);

    const handleMouseUp = useCallback(() => {
        if (isDrawing) {
            isMouseDown.current = false;
            if (lines.length > 0 && lines[0].length > 0) {
                setBackgroundLines(prevBackgroundLines => [...prevBackgroundLines, lines[0]]);
            }
            setLines([]);
        }
    }, [isDrawing, lines]);

    const handleMouseMove = useCallback((e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
        if (isDrawing && isMouseDown.current) {
            const coords = getCanvasCoords(e);
            if (coords) {
                setLines(prevLines => {
                    if (prevLines.length === 0) {
                        return [[{ ...coords, color: pencilColor, originalColor: pencilColor }]];
                    }
                    const lastLine = prevLines[prevLines.length - 1];
                    return [...prevLines.slice(0, -1), [...lastLine, { ...coords, color: pencilColor, originalColor: pencilColor }]];
                });
            }
        }
    }, [isDrawing, isMouseDown, pencilColor, getCanvasCoords]);

    const toggleDrawingMode = () => {
        setIsDrawing(!isDrawing);
        if (isDrawing) {
            setBackgroundLines(prevBackgroundLines =>
                prevBackgroundLines.map(line =>
                    line.map(point => ({ ...point, color: 'rgba(0,0,0,0.1)' }))
                )
            );
            setLines([]);
        } else {
            setBackgroundLines(prevBackgroundLines =>
                prevBackgroundLines.map(line => {
                    const originalColor = line[0].originalColor || 'black';
                    return line.map(point => ({ ...point, color: originalColor }));
                })
            );
        }
    };

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

    //mouseUp, mouseDown
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousedown', handleMouseDown)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousedown', handleMouseDown)
        };
    }, [handleMouseMove, handleMouseUp, handleMouseDown]);

    //setHasMounted
    useEffect(() => {
        setHasMounted(true);
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

    //handleWheel for horizontal scrolling and resizing
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
                    mousePos={mousePos}
                    isDrawing={isDrawing}
                    lines={lines}
                    backgroundLines={backgroundLines} />}
            </div>
            <div className="layout-main" ref={mainContainerRef} >
                <section id="keaton-nemes" className="top-level-section" > <div className="page-content"> <Home /> </div> </section>
                <section id="projects" className="top-level-section" ref={projectSectionRef}> <div className="page-content"> <Project isDrawing={isDrawing} setIsDrawing={setIsDrawing} pencilColor={pencilColor} setPencilColor={setPencilColor} lines={lines} setLines={setLines} backgroundLines={backgroundLines} setBackgroundLines={setBackgroundLines} clearCanvas={clearCanvas} /> </div> </section>
                <section id="about" className="top-level-section"> <div className="page-content"> <About isDrawing={isDrawing} setIsDrawing={setIsDrawing} pencilColor={pencilColor} setPencilColor={setPencilColor} lines={lines} setLines={setLines} backgroundLines={backgroundLines} setBackgroundLines={setBackgroundLines} clearCanvas={clearCanvas} /> </div> </section>
                <section id="contact" className="top-level-section"> <div className="page-content"> <Contact isDrawing={isDrawing} setIsDrawing={setIsDrawing} pencilColor={pencilColor} setPencilColor={setPencilColor} lines={lines} setLines={setLines} backgroundLines={backgroundLines} setBackgroundLines={setBackgroundLines} clearCanvas={clearCanvas} /> </div> </section>
            </div>
            <Footer currentPage={currentSectionIndex + 1} totalPages={totalPages} />
        </div>
    );
}

Layout.propTypes = {
    isDrawing: PropTypes.bool.isRequired,
    setIsDrawing: PropTypes.func.isRequired,
    pencilColor: PropTypes.string.isRequired,
    setPencilColor: PropTypes.func.isRequired,
    clearCanvas: PropTypes.func.isRequired,
    lines: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        color: PropTypes.string
    })).isRequired,
    setLines: PropTypes.func.isRequired,
    setBackgroundLines: PropTypes.func.isRequired,
    backgroundLines: PropTypes.arrayOf(
        PropTypes.arrayOf( // Array of lines
            PropTypes.shape({ // Each line is an array of points
                x: PropTypes.number.isRequired,
                y: PropTypes.number.isRequired,
                color: PropTypes.string,
            })
        )
    ).isRequired
};

export default Layout;