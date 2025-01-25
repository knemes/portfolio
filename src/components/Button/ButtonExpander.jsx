import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ButtonExpander.css';

function ButtonExpander({ children, expandDirection = 'left', onToggle}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef(null)
    const [contentWidth, setContentWidth] = useState(0)

    useEffect(() => {
        if (containerRef.current) {
            setContentWidth(containerRef.current.offsetWidth)
        }
    }, [isExpanded])

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        if (onToggle) {
            onToggle(!isExpanded);
        }
    };

    const containerStyle = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
    };

    const contentStyle = {
        position: 'absolute', // Absolute positioning for content
        top: 0,
        right: 0,
        transition: 'width 0.3s ease-in-out', // Transition width
        width: isExpanded ? 'auto' : 0, // Animate width
        overflow: 'hidden',
        display: 'flex'
    };

    return (
        <div className="button-expander" style={containerStyle}>
            <div className="expander-content" style={contentStyle} ref={containerRef}>
                {children}
            </div>
            <button className="expander-toggle" onClick={toggleExpand}>
                {isExpanded ? '<' : '>'}
            </button>
        </div>
    );
}

ButtonExpander.propTypes = {
    children: PropTypes.node.isRequired,
    expandDirection: PropTypes.oneOf(['left', 'right']),
    onToggle: PropTypes.func,
};

export default ButtonExpander;