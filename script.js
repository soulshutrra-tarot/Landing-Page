// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. Theme Management (Light/Dark Mode)
    // ==========================================
    const getPreferredTheme = () => {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const setTheme = (theme) => {
        const html = document.documentElement;
        html.classList.add('theme-switching');
        
        if (theme === 'dark') {
            html.classList.add('dark-mode');
        } else {
            html.classList.remove('dark-mode');
        }
        
        localStorage.setItem('theme', theme);
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                html.classList.remove('theme-switching');
            });
        });
    };

    setTheme(getPreferredTheme());

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark-mode');
            setTheme(isDark ? 'light' : 'dark');
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ==========================================
    // 1. Sticky Header & Active Nav Links
    // ==========================================
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active State for Nav Links
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 2. Mobile Navigation Toggle
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.add('active');
    });

    closeMenuBtn.addEventListener('click', () => {
        mobileNav.classList.remove('active');
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    });

    // ==========================================
    // 3. Review Slider / Carousel logic
    // ==========================================
    const track = document.getElementById('reviewsTrack');
    const cards = Array.from(track.children);
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    const dotsContainer = document.getElementById('sliderDots');
    
    let currentIndex = 0;
    
    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.children);

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateSlider();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto slide
    let sliderInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    const sliderContainer = document.querySelector('.reviews-slider-container');
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(sliderInterval);
    });
    sliderContainer.addEventListener('mouseleave', () => {
        sliderInterval = setInterval(nextSlide, 5000);
    });

    // Init active class on first card
    cards[0].classList.add('active');

    // ==========================================
    // 4. Scroll Reveal Animations
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================
    // 5. Dynamic Gallery Generation
    // ==========================================
    // Array of image URLs. Add or remove URLs here to bulk update the gallery
    const clinicPhotos = [
        "Soul_Shutrra_img_2.svg",
        "Soul_Shutrra_img_3.svg",
        "Soul_Shutrra_img_4.svg",
        "Soul_Shutrra_img_5.svg",
        "Soul_Shutrra_img_6.svg",
        "Soul_Shutrra_img_7.svg",
        "Soul_Shutrra_img_8.svg",
        "Soul_Shutrra_img_4.svg",
    ];

    const galleryGrid = document.getElementById('photoGallery');
    if (galleryGrid) {
        clinicPhotos.forEach((photoUrl, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item reveal-bottom';
            item.style.transitionDelay = `${index * 0.1}s`;
            
            item.innerHTML = `
                <img src="${photoUrl}" alt="Clinic Facility ${index + 1}" class="gallery-img">
            `;
            galleryGrid.appendChild(item);
            
            // Re-observe for animation
            revealObserver.observe(item);
        });
    }
});
// ==========================================
// 6. Multiple Map Switcher Logic
// ==========================================
function switchMap(index) {
    const mapData = [
        {
            url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.3163192039933!2d88.38889271083447!3d22.56726967940995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277ff1480aae3%3A0x22d2932dbef61e3c!2sDr.%20Tannima%20Chakraborty!5e0!3m2!1sen!2sin!4v1773856036850!5m2!1sen!2sin", // 1st Map
            address: "36, Abinash Chandra Banerjee Ln, Beleghata, Kolkata 700010",
            title: "HOME Clinic",
            directions: "https://maps.app.goo.gl/..."
        },
        {
            url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.3087963943776!2d88.38997751083447!3d22.567551179409755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02767cd9b36793%3A0xa75c7f9512120aea!2sCosmos!5e0!3m2!1sen!2sin!4v1773856074646!5m2!1sen!2sin", // 2nd Map
            address: "No.15A, Hem Chandra Naskar Road,Abinash Chandra Banerjee Lane, Subhas Sarobar Park, Phoolbagan, Kankurgachi, Kolkata, West Bengal 700010",
            title: "COSMOS Clinic",
            directions: "https://maps.app.goo.gl/..."
        },
        {
            url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.4057656735895!2d88.38912397526664!3d22.563922379497875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277812d74df4b%3A0xaf90ee9636d3fd01!2sM.%20M%20PUHAN%20HEALING%20HOME!5e0!3m2!1sen!2sin!", // 3rd Map
            address: "H97R+HM8, Subhas Sarobar Park, Phoolbagan, Beleghata, Kolkata, West Bengal 700010",
            title: "M M Puhan",
            directions: "https://maps.app.goo.gl/..."
        }
    ];

    // 1. Update the Map Frame Source
    const mapFrame = document.getElementById('map-frame');
    if(mapFrame) mapFrame.src = mapData[index].url;
    
    // 2. Update Address Text and Title
    const locTitle = document.getElementById('loc-title');
    const locAddr = document.getElementById('loc-addr');
    if(locTitle) locTitle.innerText = mapData[index].title;
    if(locAddr) locAddr.innerText = mapData[index].address;
    
    // 3. Update Directions Link
    const dirLink = document.getElementById('dir-link');
    if(dirLink) dirLink.href = mapData[index].directions;

    // 4. Update Button Animation (The "Active" class)
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach((tab, i) => {
        if (i === index) {
            tab.classList.add('active'); // Adds the blue background
        } else {
            tab.classList.remove('active'); // Removes it from others
        }
    });
}