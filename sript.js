
// LÓGICA DEL CAROUSEL - JavaScript puro
document.addEventListener('DOMContentLoaded', function() {
    // Selección de elementos del DOM
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-button');
    const prevButton = document.querySelector('.prev-button');
    const followButton = document.querySelector('.follow-button');
    
    // Variables de control del carousel
    let slideWidth = 0;
    let slideIndex = 0;
    let slidesToShow = 3;
    const slideCount = slides.length;
    let isAnimating = false;
    
    // Función para calcular slides visibles según el ancho de pantalla
    function calculateSlidesToShow() {
        const windowWidth = window.innerWidth;
        if (windowWidth < 480) {
            return 1;
        } else if (windowWidth < 768) {
            return 2;
        } else {
            return 3;
        }
    }
    
    // Función para calcular el ancho de los slides
    function calculateSlideWidth() {
        if (slides.length > 0) {
            const slideRect = slides[0].getBoundingClientRect();
            const trackRect = track.getBoundingClientRect();
            const gap = 24; // Gap entre slides (1.5rem = 24px)
            
            slideWidth = slideRect.width + gap;
            slidesToShow = calculateSlidesToShow();
        }
    }
    
    // Función principal para mover el carousel
    function moveToSlide(targetIndex, smooth = true) {
        if (isAnimating) return;
        
        // Validar límites
        const maxIndex = Math.max(0, slideCount - slidesToShow);
        
        if (targetIndex < 0) {
            slideIndex = 0;
        } else if (targetIndex > maxIndex) {
            slideIndex = maxIndex;
        } else {
            slideIndex = targetIndex;
        }
        
        // Aplicar transformación
        const translateX = slideIndex * slideWidth;
        
        if (smooth) {
            isAnimating = true;
            track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
            
            // Liberar animación después de completarse
            setTimeout(() => {
                isAnimating = false;
            }, 600);
        } else {
            track.style.transition = 'none';
        }
        
        track.style.transform = `translateX(-${translateX}px)`;
        
        // Actualizar estado de botones
        updateButtonStates();
    }
    
    // Función para actualizar el estado visual de los botones
    function updateButtonStates() {
        const maxIndex = Math.max(0, slideCount - slidesToShow);
        
        // Deshabilitar/habilitar botones según posición
        if (slideIndex <= 0) {
            prevButton.style.opacity = '0.5';
            prevButton.style.pointerEvents = 'none';
        } else {
            prevButton.style.opacity = '1';
            prevButton.style.pointerEvents = 'auto';
        }
        
        if (slideIndex >= maxIndex) {
            nextButton.style.opacity = '0.5';
            nextButton.style.pointerEvents = 'none';
        } else {
            nextButton.style.opacity = '1';
            nextButton.style.pointerEvents = 'auto';
        }
    }
    
    // Función para manejar el redimensionamiento de ventana
    function handleResize() {
        calculateSlideWidth();
        moveToSlide(slideIndex, false); // Sin animación en resize
    }
    
    // Función para agregar efecto de botón presionado
    function addButtonPressEffect(button) {
        button.classList.add('active');
        setTimeout(() => {
            button.classList.remove('active');
        }, 300);
    }
    
    // Event Listeners
    
    // Botón siguiente
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            e.preventDefault();
            moveToSlide(slideIndex + 1);
            addButtonPressEffect(this);
        });
    }
    
    // Botón anterior
    if (prevButton) {
        prevButton.addEventListener('click', function(e) {
            e.preventDefault();
            moveToSlide(slideIndex - 1);
            addButtonPressEffect(this);
        });
    }
    
    // Botón de seguir (si existe)
    if (followButton) {
        followButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Alternar texto del botón
            const currentText = this.textContent.trim();
            if (currentText === 'Siguiendo' || currentText === 'Following') {
                this.textContent = 'Seguir';
            } else if (currentText === 'Seguir' || currentText === 'Follow') {
                this.textContent = 'Siguiendo';
            } else {
                // Texto por defecto si no coincide
                this.textContent = 'Siguiendo';
            }
            
            // Efecto visual de clic
            addButtonPressEffect(this);
        });
    }
    
    // Redimensionamiento de ventana con debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // Navegación por teclado
    document.addEventListener('keydown', function(e) {
        // Solo funcionar si el carousel está en focus
        const carouselContainer = document.querySelector('.carousel-container');
        if (!carouselContainer.contains(document.activeElement)) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                moveToSlide(slideIndex - 1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                moveToSlide(slideIndex + 1);
                break;
            case 'Home':
                e.preventDefault();
                moveToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                moveToSlide(slideCount - slidesToShow);
                break;
        }
    });
    
    // Soporte básico para touch/swipe en móviles
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    if (track) {
        track.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        track.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            const deltaX = touchStartX - touchEndX;
            const deltaY = Math.abs(touchStartY - touchEndY);
            
            // Solo procesar swipe horizontal si es mayor que vertical
            if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe izquierda - siguiente
                    moveToSlide(slideIndex + 1);
                } else {
                    // Swipe derecha - anterior
                    moveToSlide(slideIndex - 1);
                }
            }
        }, { passive: true });
    }
    
    // Funciones de utilidad para uso externo (opcional)
    
    // Función para ir a un slide específico
    window.goToSlide = function(index) {
        moveToSlide(index);
    };
    
    // Función para obtener información del carousel
    window.getCarouselInfo = function() {
        return {
            currentSlide: slideIndex,
            totalSlides: slideCount,
            slidesToShow: slidesToShow,
            maxSlide: slideCount - slidesToShow
        };
    };
    
    // Función para auto-play (uso opcional)
    let autoPlayInterval;
    
    window.startAutoPlay = function(intervalMs = 5000) {
        stopAutoPlay(); // Limpiar cualquier intervalo existente
        
        autoPlayInterval = setInterval(() => {
            const maxIndex = slideCount - slidesToShow;
            const nextIndex = slideIndex >= maxIndex ? 0 : slideIndex + 1;
            moveToSlide(nextIndex);
        }, intervalMs);
    };
    
    window.stopAutoPlay = function() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    };
    
    // Pausar auto-play en hover (si está activado)
    if (track) {
        track.addEventListener('mouseenter', () => {
            if (autoPlayInterval) {
                stopAutoPlay();
            }
        });
        
        track.addEventListener('mouseleave', () => {
            // Reanudar auto-play si estaba activo
            // Esta lógica se puede personalizar según necesidades
        });
    }
    
    // INICIALIZACIÓN
    function initCarousel() {
        calculateSlideWidth();
        moveToSlide(0, false); // Posición inicial sin animación
        
        // Hacer el carousel accesible
        if (track) {
            track.setAttribute('role', 'region');
            track.setAttribute('aria-label', 'Carousel de proyectos');
        }
        
        // Añadir atributos de accesibilidad a los slides
        slides.forEach((slide, index) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-label', `Slide ${index + 1} de ${slideCount}`);
        });
        
        console.log('Carousel inicializado correctamente');
        console.log(`Total de slides: ${slideCount}, Slides visibles: ${slidesToShow}`);
    }
    
    // Inicializar cuando el DOM esté listo
    initCarousel();
});



    /**
 * UNLEASHING INNOVATION - AGENCY WEBSITE
 * Complete JavaScript with GSAP Animations and Interactions
 */

// =====================================================
// LOADER FUNCTIONALITY (Optional)
// =====================================================

/**
 * Initialize and manage loading screen
 */
function initLoader() {
    document.addEventListener('DOMContentLoaded', function() {
        // Hide content while loading
        document.body.classList.add('loading');
        
        // When everything is loaded
        window.addEventListener('load', function() {
            setTimeout(function() {
                // Show content
                document.body.classList.add('loaded');
                
                // Hide loader
                const loaderContainer = document.getElementById('loader-container');
                if (loaderContainer) {
                    loaderContainer.style.opacity = '0';
                    
                    // Remove loader after animation
                    setTimeout(function() {
                        loaderContainer.style.display = 'none';
                    }, 500);
                }
            }, 1000); // Adjust timing as needed
        });
    });
}

// =====================================================
// GSAP ANIMATIONS AND SCROLL TRIGGERS
// =====================================================

/**
 * Initialize all GSAP animations
 */
function initGSAPAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // ===== SCROLL TRIGGER FOR WE ARE SECTION =====
    ScrollTrigger.create({
        trigger: '.weare',
        start: 'top bottom',
        end: 'bottom bottom',
        pin: '#scene-inner',
    });

    // ===== HORIZONTAL SCROLL FOR SERVICES =====
    let scrollTween = gsap.to('.servicios', {
        x: () => -(document.querySelector('.servicios').scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: '.secciones_home',
            pin: true,
            scrub: true,
            start: 'bottom bottom',
            end: 3000,
        }
    });

    // ===== PIN SCENE INNER DURING SERVICES SCROLL =====
    ScrollTrigger.create({
        trigger: '.secciones_home',
        start: 'bottom bottom',
        end: 3000,
        pin: '#scene-inner',
    });

    // ===== DYNAMIC ICON AND TEXT ANIMATIONS =====
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".secciones_home",
            start: "bottom bottom",
            end: 3000,
            scrub: true,
        },
    });

    // Web Development Phase
    timeline.to(".web_ico", { opacity: 1, duration: 1 }, 0);
    timeline.to(".web", { opacity: 1, y: 0, duration: 1 }, 0);
    timeline.to(".web_ico", { opacity: 0, duration: 1 }, 1);
    timeline.to(".web", { opacity: 0, y: -20, duration: 1 }, 1);

    // Digital Innovation Phase
    timeline.to(".digital_ico", { opacity: 1, duration: 1 }, 2);
    timeline.to(".digital", { opacity: 1, y: 0, duration: 1 }, 2);
    timeline.to(".digital_ico", { opacity: 0, duration: 1 }, 3);
    timeline.to(".digital", { opacity: 0, y: -20, duration: 1 }, 3);

    // Brand Identity Phase
    timeline.to(".brand_ico", { opacity: 1, duration: 1 }, 4);
    timeline.to(".brand", { opacity: 1, y: 0, duration: 1 }, 4);

    // ===== HEADER ENTRANCE ANIMATIONS =====
    gsap.to(".menu-wrapper", { 
        duration: 1.25, 
        x: 0, 
        delay: 0.5 
    });
    
    gsap.to(".logo-wrapper", { 
        duration: 1.25, 
        x: 0, 
        delay: 0.5 
    });
}

// =====================================================
// MENU INTERACTIONS
// =====================================================

/**
 * Initialize menu hover animations for desktop
 */
function initMenuAnimations() {
    const menuWrapper = document.querySelector(".menu-wrapper");
    const menuChildren = document.querySelectorAll(".menu-child");

    if (!menuWrapper || !menuChildren.length) return;

    // Menu expansion animation
    const hoverAnimation = gsap.to(menuChildren, {
        width: "auto",
        opacity: 1,
        duration: 0.9,
        paused: true
    });

    // Menu button animation
    const buttonAnimation = gsap.to('.menu-toggle', {
        fontSize: 0,
        padding: '0px 0px 0px 0px',
        width: '15px',
        height: '15px',
        duration: 0.3,
        ease: 'ease',
        paused: true
    });

    // Desktop hover events
    menuWrapper.addEventListener("mouseenter", () => {
        if (!isMobile()) {
            hoverAnimation.play();
            buttonAnimation.play();
        }
    });

    menuWrapper.addEventListener("mouseleave", () => {
        if (!isMobile()) {
            hoverAnimation.reverse();
            buttonAnimation.reverse();
        }
    });
}

// =====================================================
// MOBILE MENU FUNCTIONALITY
// =====================================================

/**
 * Check if device is mobile
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    document.addEventListener('DOMContentLoaded', function() {
        // Add span element to menu toggle for hamburger animation
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle && !menuToggle.querySelector('span')) {
            menuToggle.innerHTML = '<span></span>' + menuToggle.innerHTML;
        }

        // Create and add overlay element
        let overlay = document.querySelector('.menu-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.classList.add('menu-overlay');
            document.body.appendChild(overlay);
        }

        /**
         * Toggle mobile menu state
         */
        function toggleMenu() {
            const menuWrapper = document.querySelector('.menu-wrapper');
            
            if (menuWrapper.classList.contains('open')) {
                // Close menu
                menuWrapper.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                // Open menu
                menuWrapper.classList.add('open');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }

        // Menu toggle click event
        if (menuToggle) {
            menuToggle.addEventListener('click', function(e) {
                if (isMobile()) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMenu();
                }
            });
        }

        // Close menu when clicking on menu items
        document.querySelectorAll('.menu-child').forEach(function(link) {
            link.addEventListener('click', function() {
                if (isMobile() && document.querySelector('.menu-wrapper.open')) {
                    toggleMenu();
                }
            });
        });

        // Close menu when clicking on overlay
        overlay.addEventListener('click', function() {
            if (document.querySelector('.menu-wrapper.open')) {
                toggleMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (!isMobile() && document.querySelector('.menu-wrapper.open')) {
                const menuWrapper = document.querySelector('.menu-wrapper');
                menuWrapper.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// =====================================================
// CAROUSEL FUNCTIONALITY
// =====================================================

/**
 * Initialize project carousel
 */
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const nextButton = document.querySelector('.next-button');
    const prevButton = document.querySelector('.prev-button');

    if (!track || !slides.length) return;

    let currentIndex = 0;
    const slidesToShow = isMobile() ? 1 : 3;
    const slideWidth = slides[0].offsetWidth + 20; // Include gap
    const maxIndex = Math.max(0, slides.length - slidesToShow);

    /**
     * Update carousel position
     */
    function updateCarousel() {
        const translateX = -currentIndex * slideWidth;
        track.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        if (prevButton) {
            prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
            prevButton.disabled = currentIndex === 0;
        }
        
        if (nextButton) {
            nextButton.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
            nextButton.disabled = currentIndex >= maxIndex;
        }
    }

    /**
     * Move to next slide
     */
    function nextSlide() {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    }

    /**
     * Move to previous slide
     */
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }

    // Event listeners
    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }

    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });

    track.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });

    track.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        if (Math.abs(diffX) > 50) { // Minimum swipe distance
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });

    // Auto-play functionality (optional)
    let autoPlayInterval;

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (currentIndex >= maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateCarousel();
        }, 5000); // Change slide every 5 seconds
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Start auto-play on desktop, pause on hover
    if (!isMobile()) {
        startAutoPlay();

        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);
    }

    // Initialize carousel
    updateCarousel();

    // Update on window resize
    window.addEventListener('resize', function() {
        const newSlidesToShow = isMobile() ? 1 : 3;
        if (newSlidesToShow !== slidesToShow) {
            location.reload(); // Simple solution for responsive changes
        }
    });
}

// =====================================================
// SMOOTH SCROLLING
// =====================================================

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// =====================================================
// PERFORMANCE OPTIMIZATIONS
// =====================================================

/**
 * Debounce function for performance
 */
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

/**
 * Optimize scroll events
 */
function initScrollOptimizations() {
    // Throttle scroll events for better performance
    let ticking = false;

    function updateScrollElements() {
        // Add any scroll-based updates here
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    });
}

// =====================================================
// ACCESSIBILITY ENHANCEMENTS
// =====================================================

/**
 * Initialize accessibility features
 */
function initAccessibility() {
    // Add keyboard navigation for carousel
    document.addEventListener('keydown', function(e) {
        const carousel = document.querySelector('.carousel-container');
        if (!carousel) return;

        switch(e.key) {
            case 'ArrowLeft':
                if (document.activeElement.closest('.carousel-container')) {
                    e.preventDefault();
                    document.querySelector('.prev-button')?.click();
                }
                break;
            case 'ArrowRight':
                if (document.activeElement.closest('.carousel-container')) {
                    e.preventDefault();
                    document.querySelector('.next-button')?.click();
                }
                break;
            case 'Escape':
                // Close mobile menu if open
                if (document.querySelector('.menu-wrapper.open')) {
                    document.querySelector('.menu-toggle')?.click();
                }
                break;
        }
    });

    // Add focus indicators for better accessibility
    document.addEventListener('focusin', function(e) {
        if (e.target.matches('.carousel-slide, .menu-child, .carousel-button')) {
            e.target.style.outline = '2px solid #EE3F00';
        }
    });

    document.addEventListener('focusout', function(e) {
        if (e.target.matches('.carousel-slide, .menu-child, .carousel-button')) {
            e.target.style.outline = '';
        }
    });
}

// =====================================================
// INITIALIZATION
// =====================================================

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
    // Core functionality
    initLoader();
    initGSAPAnimations();
    initMenuAnimations();
    initMobileMenu();
    initCarousel();
    initSmoothScrolling();
    initScrollOptimizations();
    initAccessibility();

    // Log successful initialization
    console.log('🎉 Unleashing Innovation - Website initialized successfully!');
}

// =====================================================
// START APPLICATION
// =====================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions for external use (if needed)
window.AgencyWebsite = {
    init,
    initCarousel,
    initMobileMenu,
    initGSAPAnimations,
    isMobile
};
