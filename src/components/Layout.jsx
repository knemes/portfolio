import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Graph from './Graph/Graph';
import './Layout.css';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Home from '../pages/HomePage'; // Import your page components
import About from '../pages/AboutPage';
import Project from '../pages/ProjectPage';
import Contact from '../pages/ContactPage';

function Layout({ isDrawing, setIsDrawing, pencilColor, setPencilColor, lines, setLines, backgroundLines, setBackgroundLines, clearCanvas }) {
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth - 200);
    const [canvasHeight, setCanvasHeight] = useState(window.innerHeight - 200);
    const [scrollCount, setScrollCount] = useState(0);
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const isMouseDown = useRef(false);
    const canvasRef = useRef(null);
    const mainContainerRef = useRef(null);
    const location = useLocation();
    const navLinksRef = useRef(null);
    const sectionWidthRef = useRef(window.innerWidth);

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

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const mainContainer = mainContainerRef.current;
        const navLinksContainer = navLinksRef.current; // Get the container for the links

        if (mainContainer && navLinksContainer) { // Check if refs are available
            const sections = mainContainer.querySelectorAll('section');
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

    useEffect(() => {
        if (mainContainerRef.current) {
            const mainContainer = mainContainerRef.current; // Assuming sections are full viewport width

            const handleWheel = (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();

                    setScrollCount((prevCount) => prevCount + (e.deltaY > 0 ? 1 : -1));

                    const currentPage = Math.round(mainContainer.scrollLeft / sectionWidthRef.current);
                    const targetPage = currentPage + (e.deltaY > 0 ? 1 : -1);
                    const targetScrollLeft = targetPage * sectionWidthRef.current;

                    mainContainer.scrollTo({
                        left: targetScrollLeft,
                        behavior: 'smooth',
                    });

                    setScrollCount(0); // Reset after each page scroll
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
            };

            const handleResize = () => {
                sectionWidthRef.current = window.innerWidth; // Update sectionWidth
                scrollToCurrentSection();
            };

            window.addEventListener('resize', handleResize);
            mainContainer.addEventListener('wheel', handleWheel);


            return () => {
                mainContainer.removeEventListener('wheel', handleWheel);
            };
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
            <div className="layout-main" ref={ mainContainerRef } >
                <section id="keaton-nemes"> <div className="page-content"> <Home isDrawing={isDrawing} setIsDrawing={setIsDrawing} pencilColor={pencilColor} setPencilColor={setPencilColor} lines={lines} setLines={setLines} backgroundLines={backgroundLines} setBackgroundLines={setBackgroundLines} clearCanvas={clearCanvas} /> </div> </section>
                <section id="about"> <div className="page-content"> <About isDrawing={isDrawing} setIsDrawing={setIsDrawing} pencilColor={pencilColor} setPencilColor={setPencilColor} lines={lines} setLines={setLines} backgroundLines={backgroundLines} setBackgroundLines={setBackgroundLines} clearCanvas={clearCanvas} /> </div> </section>
                <section id="projects"> <div className="page-content"> <Project isDrawing={isDrawing} setIsDrawing={setIsDrawing} pencilColor={pencilColor} setPencilColor={setPencilColor} lines={lines} setLines={setLines} backgroundLines={backgroundLines} setBackgroundLines={setBackgroundLines} clearCanvas={clearCanvas} /> </div> </section>
                <section id="contact"> <div className="page-content"> <Contact isDrawing={isDrawing} setIsDrawing={setIsDrawing} pencilColor={pencilColor} setPencilColor={setPencilColor} lines={lines} setLines={setLines} backgroundLines={backgroundLines} setBackgroundLines={setBackgroundLines} clearCanvas={clearCanvas} /> </div> </section>
            </div>
            <Footer />
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
    ).isRequired,
};

export default Layout;