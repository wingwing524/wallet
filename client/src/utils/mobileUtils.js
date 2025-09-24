// Mobile interaction utilities for enhanced UX

// Haptic feedback for iOS devices
export const hapticFeedback = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    // iOS haptic feedback
    if (window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        // Light haptic feedback
        if (navigator.vibrate) navigator.vibrate([10]);
      } catch (error) {
        console.log('Haptic feedback not supported');
      }
    }
  },
  
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },
  
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30]);
    }
  },
  
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 5, 10]);
    }
  },
  
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 10, 20, 10, 20]);
    }
  }
};

// Pull to refresh utilities
export const pullToRefresh = {
  threshold: 80,
  maxDistance: 120,
  
  setup: (element, onRefresh) => {
    let startY = 0;
    let currentY = 0;
    let isRefreshing = false;
    let isPulling = false;
    
    const handleTouchStart = (e) => {
      if (element.scrollTop === 0 && !isRefreshing) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    };
    
    const handleTouchMove = (e) => {
      if (!isPulling || isRefreshing) return;
      
      currentY = e.touches[0].clientY;
      const pullDistance = Math.min(currentY - startY, pullToRefresh.maxDistance);
      
      if (pullDistance > 0) {
        e.preventDefault();
        element.style.transform = `translateY(${pullDistance * 0.5}px)`;
        element.style.opacity = 1 - (pullDistance / pullToRefresh.maxDistance) * 0.2;
        
        if (pullDistance > pullToRefresh.threshold) {
          hapticFeedback.light();
          element.style.backgroundColor = 'rgba(0, 122, 255, 0.1)';
        } else {
          element.style.backgroundColor = '';
        }
      }
    };
    
    const handleTouchEnd = () => {
      if (!isPulling || isRefreshing) return;
      
      const pullDistance = currentY - startY;
      
      if (pullDistance > pullToRefresh.threshold) {
        isRefreshing = true;
        hapticFeedback.success();
        element.style.transform = `translateY(40px)`;
        element.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        
        onRefresh().finally(() => {
          setTimeout(() => {
            isRefreshing = false;
            element.style.transform = '';
            element.style.opacity = '';
            element.style.backgroundColor = '';
            element.style.transition = '';
          }, 500);
        });
      } else {
        hapticFeedback.light();
        element.style.transform = '';
        element.style.opacity = '';
        element.style.backgroundColor = '';
        element.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        
        setTimeout(() => {
          element.style.transition = '';
        }, 200);
      }
      
      isPulling = false;
      startY = 0;
      currentY = 0;
    };
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }
};

// Swipe gesture utilities
export const swipeGestures = {
  setup: (element, { onSwipeLeft, onSwipeRight, threshold = 50 }) => {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isTracking = false;
    
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isTracking = true;
    };
    
    const handleTouchMove = (e) => {
      if (!isTracking) return;
      
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
      
      const deltaX = currentX - startX;
      const deltaY = Math.abs(currentY - startY);
      
      // Only process horizontal swipes
      if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
        e.preventDefault();
        
        // Visual feedback during swipe
        const opacity = Math.max(0.5, 1 - Math.abs(deltaX) / 200);
        element.style.transform = `translateX(${deltaX * 0.3}px)`;
        element.style.opacity = opacity;
        
        if (Math.abs(deltaX) > threshold) {
          hapticFeedback.light();
        }
      }
    };
    
    const handleTouchEnd = () => {
      if (!isTracking) return;
      
      const deltaX = currentX - startX;
      const deltaY = Math.abs(currentY - startY);
      
      // Reset visual state
      element.style.transform = '';
      element.style.opacity = '';
      element.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
      
      setTimeout(() => {
        element.style.transition = '';
      }, 200);
      
      // Check for valid swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        hapticFeedback.medium();
        
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
      
      isTracking = false;
      startX = 0;
      startY = 0;
      currentX = 0;
      currentY = 0;
    };
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }
};

// Search utilities
export const searchUtils = {
  fuzzySearch: (items, query, fields) => {
    if (!query) return items;
    
    const searchTerm = query.toLowerCase();
    
    return items.filter(item => {
      return fields.some(field => {
        const value = item[field];
        if (!value) return false;
        
        const text = value.toString().toLowerCase();
        return text.includes(searchTerm) || 
               searchTerm.split(' ').every(term => text.includes(term));
      });
    });
  },
  
  highlightText: (text, query) => {
    if (!query || !text) return text;
    
    const searchTerm = query.toLowerCase();
    const textLower = text.toLowerCase();
    const index = textLower.indexOf(searchTerm);
    
    if (index === -1) return text;
    
    return (
      text.substring(0, index) +
      `<mark>${text.substring(index, index + searchTerm.length)}</mark>` +
      text.substring(index + searchTerm.length)
    );
  }
};

// Loading state utilities
export const loadingStates = {
  skeleton: (count = 3) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `skeleton-${i}`,
      isLoading: true
    }));
  }
};
