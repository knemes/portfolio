import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './ButtonExpander.css';

function ButtonExpander({ children, isDrawing, setIsDrawing, expandDirection = 'left', toggleLabel = '>', collapseLabel = '<' }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [contentWidth, setContentWidth] = useState(0)
    const contentRef = useRef(null);
    const toggleRef = useRef(null);

    const setToggleRef = useCallback((node) => {
        toggleRef.current = node;
    }, []);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        setIsDrawing(!isDrawing);
    };

    useEffect(() => {
        if (isExpanded && contentRef.current && toggleRef.current) {
            const childrenArray = Array.from(contentRef.current.children);

            childrenArray.forEach((child, index) => {
                setTimeout(() => {
                    child.style.visibility = 'visible';
                    child.style.transform = 'translateX(0)';
                }, index * 100);
            });
        } else if (contentRef.current) {
            const toggleWidth = toggleRef.current.offsetWidth;
            const childrenArray = Array.from(contentRef.current.children);
            childrenArray.forEach((child) => {
                child.style.visibility = 'hidden';
                child.style.transform = `translateX(${toggleWidth}px)`;
            });
        }
    }, [isExpanded]);

    const containerStyle = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
    };

    const contentStyle = {
        transition: 'transform 0.5s ease-in-out, visibility 0.5s ease-in-out',
        visibility: isExpanded ? 'visible' : 'hidden', // Still use visibility 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        padding: '10px',
        whiteSpace: 'nowrap',
        transform: isExpanded ? 'translateX(0)' : `translateX(${expandDirection === 'left' ? '100%' : '-100%'})`,
    };

    return (
        <div className="button-expander" style={containerStyle}>
            <div className="expander-content" style={contentStyle} ref={contentRef}>
                {children}
            </div>
            <button className="expander-toggle" onClick={toggleExpand} ref={setToggleRef}>
                {isExpanded ? collapseLabel : toggleLabel}
            </button>
        </div>
    );
}

ButtonExpander.propTypes = {
    children: PropTypes.node.isRequired,
    expandDirection: PropTypes.oneOf(['left', 'right', 'up', 'down']),
    isDrawing: PropTypes.bool.isRequired,
    setIsDrawing: PropTypes.func.isRequired,
    toggleLabel: PropTypes.string,
    collapseLabel: PropTypes.string,
};

export default ButtonExpander;