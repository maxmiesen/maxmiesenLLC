console.log("✅ script.js is loaded and running!");

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ JavaScript is running!");

    let url = window.location.pathname;

    // Check if the URL ends with .html
    if (url.endsWith(".html")) {
        let newUrl = url.replace(".html", ""); // Remove .html
        window.history.replaceState({}, document.title, newUrl);
    }

    // Ensure index.html redirects to root
    if (url.endsWith("/index")) {
        window.history.replaceState({}, document.title, "/");
    }
    const slideshows = {
        "2019_2022_slideshow": { count: 33, prefix: "2019_2022" },  // Ensure ID matches HTML
        "portraits2025_slideshow": { count: 4, prefix: "Portraits2025" } // Fixed slideshow ID
    };

    let slideIndexes = {}; // Store slide indexes for each slideshow

    Object.keys(slideshows).forEach(slideshowId => {
        let slideshowContainer = document.getElementById(slideshowId);
        if (!slideshowContainer) {
            console.error(`❌ Slideshow container not found: ${slideshowId}`);
            return; // Stops execution if the ID doesn't exist in HTML
        }

        slideIndexes[slideshowId] = 0; // Start at first slide

        // Dynamically create slides
        for (let i = 1; i <= slideshows[slideshowId].count; i++) {
            let slide = document.createElement("div");
            slide.className = "slide";

            let img = document.createElement("img");

            // ✅ Ensure filenames have four-digit zero-padded format (e.g., 00001, 00002, ...)
            let imgNum = String(i).padStart(5, '0');
            let imgSrcJpg = `${slideshows[slideshowId].prefix}_${imgNum}.jpg`;
            let imgSrcArw = `${slideshows[slideshowId].prefix}_${imgNum}.ARW`;

            console.log(`🖼️ Loading images: ${imgSrcJpg}, ${imgSrcArw}`);
            img.src = imgSrcJpg;
            img.alt = `Slide ${i}`;

            img.onload = () => console.log(`✅ Image Loaded: ${imgSrcJpg}`);
            img.onerror = () => {
                console.error(`❌ Image NOT Found: ${imgSrcJpg}, trying ARW format`);
                img.src = imgSrcArw;
                img.onload = () => console.log(`✅ Image Loaded: ${imgSrcArw}`);
                img.onerror = () => console.error(`❌ Image NOT Found: ${imgSrcArw}`);
            };

            slide.appendChild(img);
            slideshowContainer.appendChild(slide);
        }

        // Ensure the first slide is visible immediately
        let firstSlide = document.querySelector(`#${CSS.escape(slideshowId)} .slide`);
        if (firstSlide) firstSlide.style.display = "block";

        // Start the slideshow
        showSlides(slideshowId);
    });

    function showSlides(slideshowId) {
        let slides = document.querySelectorAll(`#${CSS.escape(slideshowId)} .slide`);
        if (!slides.length) {
            console.error(`❌ No slides found for ${slideshowId}`);
            return;
        }

        slides.forEach(slide => (slide.style.display = "none"));
        slideIndexes[slideshowId]++;

        if (slideIndexes[slideshowId] > slides.length) {
            slideIndexes[slideshowId] = 1;
        }

        slides[slideIndexes[slideshowId] - 1].style.display = "block";

        setTimeout(() => showSlides(slideshowId), 3000); // Auto-advance every 3 seconds
    }

    window.changeSlide = function (n, slideshowId) {
        let slides = document.querySelectorAll(`#${CSS.escape(slideshowId)} .slide`);
        if (!slides.length) {
            console.error(`❌ No slides found for ${slideshowId}`);
            return;
        }

        slides[slideIndexes[slideshowId] - 1].style.display = "none"; // Hide current slide
        slideIndexes[slideshowId] += n;

        if (slideIndexes[slideshowId] > slides.length) slideIndexes[slideshowId] = 1;
        if (slideIndexes[slideshowId] < 1) slideIndexes[slideshowId] = slides.length;

        slides[slideIndexes[slideshowId] - 1].style.display = "block";
    };
    
});

// Projects Carousel Functionality
let currentProjectIndex = 1;
const totalProjects = 7;

function showProject(n) {
    const slides = document.querySelectorAll('.project-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (n > totalProjects) currentProjectIndex = 1;
    if (n < 1) currentProjectIndex = totalProjects;
    
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active class from all indicators
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Show current slide
    if (slides[currentProjectIndex - 1]) {
        slides[currentProjectIndex - 1].classList.add('active');
    }
    
    // Activate current indicator
    if (indicators[currentProjectIndex - 1]) {
        indicators[currentProjectIndex - 1].classList.add('active');
    }
}

function changeProject(direction) {
    currentProjectIndex += direction;
    showProject(currentProjectIndex);
}

function currentProject(n) {
    currentProjectIndex = n;
    showProject(currentProjectIndex);
}

// Auto-advance carousel (optional)
let autoAdvanceInterval;

function startAutoAdvance() {
    autoAdvanceInterval = setInterval(() => {
        changeProject(1);
    }, 8000); // Change project every 8 seconds
}

function stopAutoAdvance() {
    if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
    }
}

// Initialize carousel when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the projects page
    if (document.querySelector('.projects-carousel-container')) {
        showProject(1);
        startAutoAdvance();
        
        // Pause auto-advance on hover
        const carouselContainer = document.querySelector('.projects-carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoAdvance);
            carouselContainer.addEventListener('mouseleave', startAutoAdvance);
        }
    }
});

// Keyboard navigation for projects carousel
document.addEventListener('keydown', function(event) {
    if (document.querySelector('.projects-carousel-container')) {
        if (event.key === 'ArrowLeft') {
            changeProject(-1);
        } else if (event.key === 'ArrowRight') {
            changeProject(1);
        }
    }
});

// ========================================
// RESEARCH CAROUSEL FUNCTIONALITY
// ========================================

let currentReportIndex = 1;
const totalReports = 6;

function showReportSlide(n) {
    currentReportIndex = n;
    if (n > totalReports) currentReportIndex = 1;
    if (n < 1) currentReportIndex = totalReports;

    const slides = document.querySelectorAll('#tab-research .report-slide');
    const dots = document.querySelectorAll('#tab-research .research-dot');
    const counterEl = document.getElementById('currentReportNum');

    slides.forEach((slide, i) => slide.classList.toggle('active', i === currentReportIndex - 1));
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentReportIndex - 1);
        dot.setAttribute('aria-selected', i === currentReportIndex - 1);
    });
    if (counterEl) counterEl.textContent = currentReportIndex;
}

function changeReportSlide(direction) {
    showReportSlide(currentReportIndex + direction);
}

function goToReportSlide(n) {
    showReportSlide(parseInt(n, 10));
}

let reportsAutoAdvanceInterval;
function startReportsAutoAdvance() {
    reportsAutoAdvanceInterval = setInterval(() => changeReportSlide(1), 8000);
}
function stopReportsAutoAdvance() {
    if (reportsAutoAdvanceInterval) clearInterval(reportsAutoAdvanceInterval);
}

document.addEventListener('DOMContentLoaded', function() {
    const researchCarousel = document.querySelector('.research-carousel');
    if (!researchCarousel) return;

    showReportSlide(1);
    startReportsAutoAdvance();
    researchCarousel.addEventListener('mouseenter', stopReportsAutoAdvance);
    researchCarousel.addEventListener('mouseleave', startReportsAutoAdvance);

    researchCarousel.querySelectorAll('.research-dot').forEach(dot => {
        dot.addEventListener('click', () => goToReportSlide(dot.dataset.dot));
    });
});

document.addEventListener('keydown', function(e) {
    const researchCarousel = document.querySelector('.research-carousel');
    if (!researchCarousel) return;
    if (e.key === 'ArrowLeft') changeReportSlide(-1);
    else if (e.key === 'ArrowRight') changeReportSlide(1);
});

window.changeReportSlide = changeReportSlide;
window.currentReportSlide = goToReportSlide;

