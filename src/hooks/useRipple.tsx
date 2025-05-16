
import { useCallback } from 'react';

const useRipple = () => {
  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    
    // Add ripple-container class if not present
    if (!button.classList.contains('ripple-container')) {
      button.classList.add('ripple-container');
    }
    
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    // Get position relative to the button
    const rect = button.getBoundingClientRect();
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');
    
    // Remove existing ripples
    const ripples = button.getElementsByClassName('ripple');
    if (ripples.length > 0) {
      ripples[0].remove();
    }
    
    button.appendChild(circle);
    
    // Remove the ripple element after animation completes
    setTimeout(() => {
      if (circle && circle.parentElement) {
        circle.parentElement.removeChild(circle);
      }
    }, 600);
  }, []);
  
  return { createRipple };
};

export default useRipple;
