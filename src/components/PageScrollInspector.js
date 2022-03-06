import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export const SCROLL_DIRECTION = { UP: 'SCROLL_UP', DOWN: 'SCROLL_DOWN' };

export const PageScrollInspector = ({ threshold, scrollDirectionChanged, bottomReached }) => {
  const page = document.documentElement;
  const lastScrollYRef = useRef(page.scrollTop);
  const lastScrollDirectionRef = useRef(null);
  const lastBottomReachedRef = useRef(null);

  useEffect(() => {
    const onScroll = (e) => {
      const scrollY = page.scrollTop;
      if (Math.abs(scrollY - lastScrollYRef.current) > threshold) {
        const scrollDirection = scrollY > lastScrollYRef.current ? SCROLL_DIRECTION.DOWN : SCROLL_DIRECTION.UP;
        if (scrollDirection !== lastScrollDirectionRef.current) scrollDirectionChanged(scrollDirection);
        lastScrollDirectionRef.current = scrollDirection;
        const reachedBottom = Math.abs(page.scrollHeight - page.clientHeight - scrollY) < threshold;
        if (reachedBottom !== lastBottomReachedRef.current) bottomReached(reachedBottom);
        lastBottomReachedRef.current = reachedBottom;
        lastScrollYRef.current = scrollY > 0 ? scrollY : 0;
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return null;
}

PageScrollInspector.propTypes = {
  threshold: PropTypes.number,
  scrollDirectionChanged: PropTypes.func,
  bottomReached: PropTypes.func
};

PageScrollInspector.defaultProps = {
  threshold: 420,
  scrollDirectionChanged: console.log,
  bottomReached: console.log
};