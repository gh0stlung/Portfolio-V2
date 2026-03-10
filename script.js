document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();

    const mobileToggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    });

    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > lastScrollY && window.scrollY > 80) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        lastScrollY = window.scrollY;
    });

    const sections = document.querySelectorAll('section[id]');
    
    function scrollActive() {
        const scrollY = window.scrollY;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', scrollActive);

    const reveals = document.querySelectorAll('.reveal');

    function reveal() {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach(revealElement => {
            const elementTop = revealElement.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                revealElement.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    reveal();

    document.querySelectorAll('.project-image img').forEach(img => {
        img.addEventListener('click', () => {
            img.classList.toggle('zoomed');
        });
    });

    const aboutSection = document.getElementById('about');
    const aboutVideo = document.getElementById('aboutVideo');
    
    if (aboutSection && aboutVideo) {
        // Ensure video doesn't autoplay and is ready for manual seeking
        aboutVideo.pause();
        aboutVideo.removeAttribute('autoplay');
        aboutVideo.load(); // Ensure metadata is being loaded

        let isUpdating = false;

        const updateVideoOnScroll = () => {
            if (isUpdating) return;
            isUpdating = true;

            requestAnimationFrame(() => {
                const rect = aboutSection.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Check if section is visible
                if (rect.top < windowHeight && rect.bottom > 0) {
                    // Calculate scroll progress (0 to 1)
                    // 0: top of section enters bottom of viewport
                    // 1: bottom of section leaves top of viewport
                    const totalDistance = windowHeight + rect.height;
                    const currentDistance = windowHeight - rect.top;
                    let progress = currentDistance / totalDistance;
                    
                    // Clamp progress between 0 and 1
                    progress = Math.max(0, Math.min(1, progress));
                    
                    if (aboutVideo.duration && !isNaN(aboutVideo.duration)) {
                        aboutVideo.currentTime = progress * aboutVideo.duration;
                    }
                }
                isUpdating = false;
            });
        };

        window.addEventListener('scroll', updateVideoOnScroll, { passive: true });
        // Also update on resize to handle layout changes
        window.addEventListener('resize', updateVideoOnScroll, { passive: true });
        
        // Initial call when metadata is loaded
        aboutVideo.addEventListener('loadedmetadata', updateVideoOnScroll);
        
        // Fallback initial call
        if (aboutVideo.readyState >= 1) {
            updateVideoOnScroll();
        }
    }
});
