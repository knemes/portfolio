import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './HandwrittenLink.css';

function HandwrittenLink({ text, href, onClick }) {
    const linkRef = useRef(null);

    useEffect(() => {
        const spans = linkRef.current.querySelectorAll('span');
        const animationDuration = 1000;
        const delayBetweenLetters = animationDuration / spans.length;
        const animationInterval = 10000; // 10 seconds

        let startTime;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;

            spans.forEach((span, index) => {
                const delay = index * delayBetweenLetters;
                if (progress >= delay) {
                    span.style.opacity = 1;
                }
            });

            if (progress < animationDuration) {
                requestAnimationFrame(animate);
            }
        };

        const triggerAnimation = () => {
            spans.forEach(span => {
                span.style.opacity = 0;
            });

            setTimeout(() => {
                startTime = null;
                requestAnimationFrame(animate);
            }, 500);
        };

        triggerAnimation(); // Trigger on initial render

        const intervalId = setInterval(triggerAnimation, animationInterval);

        return () => {
            clearInterval(intervalId); // Clear interval on unmount
        };
    }, []);

    return (
        <a href={href} className="handwritten-link" onClick={onClick} ref={linkRef} >
            {text.split('').map((letter, index) => (
                <span key={index} className="text-letter">{letter}</span>
            ))}
        </a>
    );
}

HandwrittenLink.propTypes = {
    text: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default HandwrittenLink;