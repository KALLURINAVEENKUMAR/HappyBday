let currentSection = 0;
const totalSections = 7; // Update to 7 for the new section

// Debounce function to prevent rapid clicking
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Create floating hearts
function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    const hearts = ['💖', '💕', '💝', '✨', '🌟'];
    
    const createHeart = () => {
        if (container.children.length > 10) return; // Limit hearts for performance
        
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        container.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, 6000);
    };
    
    setInterval(createHeart, 2000);
}

// Create rain effect for silence section
function createRainEffect() {
    const rainContainer = document.querySelector('.rain-effect');
    if (!rainContainer) return;
    
    // Reduce raindrops on mobile for better performance
    const rainDropCount = window.innerWidth < 768 ? 25 : 50;
    
    for (let i = 0; i < rainDropCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDelay = Math.random() * 2 + 's';
        drop.style.animationDuration = (Math.random() * 1 + 1) + 's';
        rainContainer.appendChild(drop);
    }
}

// Navigation functions
const nextSection = debounce(() => {
    if (currentSection < totalSections - 1) {
        goToSection(currentSection + 1);
    }
}, 300);

// Song list for each section
const sectionSongs = [
    "story/src/css/song1.mp3", // Welcome
    "story/src/css/song2.mp3", // Love
    "story/src/css/song3.mp3", // Silence
    "story/src/css/song4.mp3", // Special (photos)
    "story/src/css/song5.mp3", // Promise
    "story/src/css/song6.mp3", // Gift
    "story/src/css/song7.mp3"  // Jelous
];

const sectionBackgrounds = [
    "story/src/css/photo1.jpg", // Welcome
    "story/src/css/photo2.jpg", // Love
    "story/src/css/photo3.jpg", // Silence
    "story/src/css/photo1.jpg", // Special (gallery)
    "story/src/css/photo2.jpg", // Promise
    "story/src/css/photo3.jpg", // Gift
    "story/src/css/photo1.jpg"  // Jelous (choose any image)
];

function playSectionSong(sectionIndex) {
    const audio = document.getElementById('bg-music');
    if (!audio) return;
    if (audio.src && audio.src.endsWith(sectionSongs[sectionIndex])) return; // Already playing
    audio.src = sectionSongs[sectionIndex];
    audio.currentTime = 0;
    audio.play().catch(()=>{});
}

function setSectionBackground(sectionIndex) {
    const bgDiv = document.querySelector('.background-photo');
    if (bgDiv) {
        bgDiv.style.backgroundImage = `url('${sectionBackgrounds[sectionIndex]}')`;
    }
}

// Update goToSection to play song
const goToSection = debounce((sectionNumber) => {
    if (sectionNumber === currentSection) return;
    
    // Hide current section
    const currentSectionEl = document.querySelector('.section.active');
    if (currentSectionEl) {
        currentSectionEl.classList.remove('active');
        currentSectionEl.classList.add('hidden');
    }
    
    // Show new section
    const newSectionEl = document.querySelector(`[data-section="${sectionNumber}"]`);
    if (newSectionEl) {
        newSectionEl.classList.remove('hidden');
        setTimeout(() => {
            newSectionEl.classList.add('active');
        }, 50);
    }
    
    // Update navigation dots
    document.querySelectorAll('.nav-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === sectionNumber);
    });
    
    currentSection = sectionNumber;
    setSectionBackground(currentSection);
    playSectionSong(currentSection);
    updateBackArrow();
    
    // Scroll to top on mobile to ensure proper viewing
    if (window.innerWidth <= 768) {
        window.scrollTo(0, 0);
    }
}, 300);

function startOver() {
    goToSection(0);
}

// Touch handling for mobile swipe gestures
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 50;
    
    // Only handle horizontal swipes if they're more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0 && currentSection > 0) {
            // Swipe right - go to previous section
            goToSection(currentSection - 1);
        } else if (deltaX < 0 && currentSection < totalSections - 1) {
            // Swipe left - go to next section
            goToSection(currentSection + 1);
        }
    }
}

// Optimize animations based on device performance
function optimizeForDevice() {
    const isLowEndDevice = navigator.hardwareConcurrency <= 4 || 
                          navigator.deviceMemory <= 4 ||
                          /iPhone [5-8]|iPad [1-4]/.test(navigator.userAgent);
    
    if (isLowEndDevice) {
        // Reduce animations for low-end devices
        document.documentElement.style.setProperty('--animation-duration', '0.5s');
        
        // Reduce floating hearts frequency
        const style = document.createElement('style');
        style.textContent = `
            .floating-heart { animation-duration: 4s !important; }
            .love-symbol { animation-duration: 4s !important; }
        `;
        document.head.appendChild(style);
    }
}

// Handle orientation changes
function handleOrientationChange() {
    setTimeout(() => {
        // Recalculate viewport height after orientation change
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Ensure current section is properly displayed
        const currentSectionEl = document.querySelector('.section.active');
        if (currentSectionEl) {
            currentSectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 500); // Delay to allow for orientation change completion
}

// Prevent default touch behaviors that might interfere
function preventDefaultTouch(e) {
    // Allow scrolling within content boxes
    if (e.target.closest('.content-box') || e.target.closest('.letter-container')) {
        return;
    }
    
    // Prevent pull-to-refresh and overscroll
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (!element || !element.closest('.content-box, .letter-container')) {
            e.preventDefault();
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set initial viewport height for mobile
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Initialize effects
    createFloatingHearts();
    createRainEffect();
    optimizeForDevice();
    
    // Add touch event listeners for swipe gestures
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchmove', preventDefaultTouch, { passive: false });
    
    // Add orientation change listener
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                nextSection();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (currentSection > 0) {
                    goToSection(currentSection - 1);
                }
                break;
            case 'Home':
                e.preventDefault();
                goToSection(0);
                break;
            case 'End':
                e.preventDefault();
                goToSection(totalSections - 1);
                break;
        }
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.section !== undefined) {
            goToSection(e.state.section);
        }
    });
    
    // Set initial state
    history.replaceState({ section: 0 }, '', window.location.href);
    playSectionSong(0);
    setSectionBackground(0);
    updateBackArrow();
    
    document.querySelector('.btn').addEventListener('click', function() {
        const audio = document.getElementById('bg-music');
        if (audio.paused) {
            audio.play();
        }
    });
});

// Handle page visibility changes (for battery optimization)
document.addEventListener('visibilitychange', () => {
    const isHidden = document.hidden;
    const animatedElements = document.querySelectorAll('.floating-heart, .love-symbol, .raindrop');
    
    animatedElements.forEach(el => {
        if (isHidden) {
            el.style.animationPlayState = 'paused';
        } else {
            el.style.animationPlayState = 'running';
        }
    });
});

// Optimize scroll performance
let ticking = false;

function updateOnScroll() {
    // Add any scroll-based animations or updates here
    ticking = false;
}

document.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}, { passive: true });

// Global error handler
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    // Graceful degradation - remove problematic animations
    document.querySelectorAll('.floating-heart, .love-symbol').forEach(el => {
        el.style.animation = 'none';
    });
});

// Navigation functions
function goBackSection() {
    if (currentSection > 0) {
        goToSection(currentSection - 1);
    }
}

// Show/hide back arrow depending on section
function updateBackArrow() {
    const backArrow = document.querySelector('.back-arrow');
    if (!backArrow) return;
    if (currentSection > 0) {
        backArrow.style.display = 'flex';
    } else {
        backArrow.style.display = 'none';
    }
}

// Export functions for inline event handlers
window.nextSection = nextSection;
window.goToSection = goToSection;
window.startOver = startOver;
window.goBackSection = goBackSection;