import { useEffect } from "react";

interface TouchEventWithScale extends TouchEvent {
  scale?: number;
}

export const useDisableTouchGestures = (): void => {
  useEffect(() => {
    // Only run on client side (Next.js SSR safety)
    if (typeof window === 'undefined') return;

    let touchStartTime = 0;
    let touchCount = 0;

    const handleGestureStart = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    };

    const handleGestureChange = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    };

    const handleGestureEnd = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchCount = event.touches.length;
      touchStartTime = Date.now();
      
      // Block any multi-touch immediately
      if (event.touches.length > 1) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      }
    };

    const handleTouchMove = (event: TouchEventWithScale) => {
      // Block multi-touch gestures
      if (event.touches.length > 1) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      }

      // Block pinch zoom detection
      if (event.scale !== undefined && event.scale !== 1) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      }

      // Additional iOS Safari specific checks
      if (touchCount > 1) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      // Reset touch count
      touchCount = event.touches.length;
      
      if (event.touches.length > 0) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const handleDoubleClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    };

    const handleWheel = (event: WheelEvent) => {
      // Prevent zoom via mouse wheel + ctrl/cmd
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      }
    };

    // Apply CSS styles to prevent gestures
    const styleId = 'disable-touch-gestures';
    let existingStyle = document.getElementById(styleId);
    
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        html, body {
          touch-action: pan-y !important;
          -webkit-text-size-adjust: none !important;
          -webkit-user-zoom: none !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
          user-zoom: none !important;
          zoom: 1 !important;
          overscroll-behavior: auto !important;
        }
        
        * {
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          -webkit-tap-highlight-color: transparent !important;
          user-select: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Event listeners with highest priority
    const options = { 
      passive: false, 
      capture: true 
    };

    // Gesture events (iOS Safari specific)
    window.addEventListener('gesturestart', handleGestureStart, options);
    window.addEventListener('gesturechange', handleGestureChange, options);
    window.addEventListener('gestureend', handleGestureEnd, options);
    
    // Touch events
    window.addEventListener('touchstart', handleTouchStart, options);
    window.addEventListener('touchmove', handleTouchMove, options);
    window.addEventListener('touchend', handleTouchEnd, options);
    
    // Mouse events
    window.addEventListener('dblclick', handleDoubleClick, options);
    window.addEventListener('wheel', handleWheel, options);

    // Cleanup function
    return () => {
      window.removeEventListener('gesturestart', handleGestureStart, options);
      window.removeEventListener('gesturechange', handleGestureChange, options);
      window.removeEventListener('gestureend', handleGestureEnd, options);
      window.removeEventListener('touchstart', handleTouchStart, options);
      window.removeEventListener('touchmove', handleTouchMove, options);
      window.removeEventListener('touchend', handleTouchEnd, options);
      window.removeEventListener('dblclick', handleDoubleClick, options);
      window.removeEventListener('wheel', handleWheel, options);
      
      // Remove styles
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);
};