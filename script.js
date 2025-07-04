// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const photoItems = document.querySelectorAll('.photo-item');
const lightboxImg = lightbox.querySelector('img');
const closeBtn = lightbox.querySelector('.close-btn');
const zoomInBtn = lightbox.querySelector('.zoom-in');
const zoomOutBtn = lightbox.querySelector('.zoom-out');
const container = lightbox.querySelector('.lightbox-container');

let currentScale = 1;
const minScale = 1;
const maxScale = 3;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;
let lastX, lastY;

function updateTransform() {
    lightboxImg.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
}

function resetZoom() {
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
}

// Open lightbox
photoItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetZoom();
    });
});

// Close lightbox
closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    resetZoom();
});

// Zoom controls
zoomInBtn.addEventListener('click', () => {
    if (currentScale < maxScale) {
        currentScale = Math.min(currentScale + 0.5, maxScale);
        updateTransform();
    }
});

zoomOutBtn.addEventListener('click', () => {
    if (currentScale > minScale) {
        currentScale = Math.max(currentScale - 0.5, minScale);
        updateTransform();
    }
});

// Mouse wheel zoom
lightboxImg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.max(minScale, Math.min(maxScale, currentScale + delta));
    if (newScale !== currentScale) {
        const rect = lightboxImg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate new position to zoom towards mouse
        const scaleChange = newScale - currentScale;
        translateX -= (mouseX - rect.width / 2) * scaleChange / currentScale;
        translateY -= (mouseY - rect.height / 2) * scaleChange / currentScale;
        
        currentScale = newScale;
        updateTransform();
    }
});

// Drag functionality
container.addEventListener('mousedown', (e) => {
    if (currentScale > 1) {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    }
});

container.addEventListener('mousemove', (e) => {
    if (isDragging && currentScale > 1) {
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        translateX += deltaX / currentScale;
        translateY += deltaY / currentScale;
        lastX = e.clientX;
        lastY = e.clientY;
        updateTransform();
    }
});

container.addEventListener('mouseup', () => isDragging = false);
container.addEventListener('mouseleave', () => isDragging = false);

// Touch support
let lastScale = 1;
let initialDistance = 0;

container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        isDragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        isDragging = false;
        initialDistance = getDistance(e.touches[0], e.touches[1]);
        lastScale = currentScale;
    }
});

container.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - lastX;
        const deltaY = e.touches[0].clientY - lastY;
        translateX += deltaX / currentScale;
        translateY += deltaY / currentScale;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        updateTransform();
    } else if (e.touches.length === 2) {
        const distance = getDistance(e.touches[0], e.touches[1]);
        const scale = (distance / initialDistance) * lastScale;
        currentScale = Math.max(minScale, Math.min(maxScale, scale));
        updateTransform();
    }
});

container.addEventListener('touchend', () => {
    isDragging = false;
    lastScale = currentScale;
});

function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Load and display comments on page load
document.addEventListener('DOMContentLoaded', function() {
    displayComments();
});

// Countdown Timer
const weddingDate = new Date('April 8, 2027 00:00:00').getTime();

function updateTimer() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}

setInterval(updateTimer, 1000);
updateTimer();

// Music Player
const audio = document.getElementById('bgMusic');
const playButton = document.getElementById('playButton');
let isPlaying = false;

// Fix for viewport height on mobile
function fixViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Call on load and resize
window.addEventListener('load', fixViewportHeight);
window.addEventListener('resize', fixViewportHeight);
window.addEventListener('orientationchange', () => {
    setTimeout(fixViewportHeight, 100);
});

// Opening animation function
function openInvitation() {
    const wrapper = document.querySelector('.cover-wrapper');
    const leftDoor = document.querySelector('.left-door');
    const rightDoor = document.querySelector('.right-door');
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('mainContent');
    const audio = document.getElementById('bgMusic');
    
    // Force a reflow to ensure proper height calculation
    fixViewportHeight();
    
    // Prevent scrolling during animation
    document.body.style.overflow = 'hidden';
    
    // Play music (if available)
    if (audio) {
        audio.currentTime = 47;
        audio.play().catch(console.log);
    }
    
    // Ensure elements are in the right state
    wrapper.style.pointerEvents = 'none';
    mainContent.style.display = 'block';
    
    // Start animation sequence
    requestAnimationFrame(() => {
        // Fade out cover content
        cover.style.opacity = '0';
        
        // Open doors
        setTimeout(() => {
            leftDoor.classList.add('open-left');
            rightDoor.classList.add('open-right');
            
            // Start fading in main content
            setTimeout(() => {
                mainContent.classList.add('visible');
                document.body.style.overflow = '';
                
                // Clean up after animation
                setTimeout(() => {
                    wrapper.style.display = 'none';
                    // Force a reflow to prevent visual glitches
                    document.documentElement.style.opacity = '0.99';
                    setTimeout(() => {
                        document.documentElement.style.opacity = '';
                    }, 100);
                }, 1500);
            }, 500);
        }, 100);
    });
}

// Handle comments
// === LIVE COMMENTARY (FIREBASE) ===
// Ganti config berikut dengan milik Anda sendiri dari Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyC2qm8dBYpYjN9e_2CM4CNn9tvN3w2qtR0",
  authDomain: "pernikahan-6d5ad.firebaseapp.com",
  databaseURL: "https://pernikahan-6d5ad-default-rtdb.firebaseio.com",
  projectId: "pernikahan-6d5ad",
  storageBucket: "pernikahan-6d5ad.firebasestorage.app",
  messagingSenderId: "226144618456",
  appId: "1:226144618456:web:5da2988772e00003a914ad",
  measurementId: "G-2S8ZSQ93K4"
};

(function loadFirebase() {
    if (!window.firebase) {
        const script1 = document.createElement('script');
        script1.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js';
        script1.onload = () => {
            const script2 = document.createElement('script');
            script2.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js';
            script2.onload = initFirebaseComments;
            document.head.appendChild(script2);
        };
        document.head.appendChild(script1);
    } else {
        initFirebaseComments();
    }
})();

function initFirebaseComments() {
    if (!window.firebase.apps?.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();
    const commentsRef = db.ref('weddingComments');
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');

    // Listen for new comments
    commentsRef.limitToLast(50).on('value', snapshot => {
        commentsList.innerHTML = '';
        const data = snapshot.val();
        if (data) {
            const arr = Object.values(data).sort((a, b) => new Date(b.date) - new Date(a.date));
            arr.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <div class="comment-header">${comment.name}</div>
                    <div class="comment-text">${comment.message}</div>
                    <div class="comment-date">${new Date(comment.date).toLocaleString()}</div>
                `;
                commentsList.appendChild(commentElement);
            });
        }
    });

    // Submit new comment
    commentForm.onsubmit = function(e) {
        e.preventDefault();
        const name = this.querySelector('input[type="text"]').value.trim();
        const message = this.querySelector('textarea').value.trim();
        if (!name || !message) return;
        const newComment = {
            name,
            message,
            date: new Date().toISOString()
        };
        commentsRef.push(newComment, err => {
            if (!err) {
                this.reset();
            }
        });
    };
}

// RSVP Form
let rsvpList = JSON.parse(localStorage.getItem('weddingRSVP') || '[]');

document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = this.querySelector('input[type="text"]').value;
    const guests = this.querySelector('input[type="number"]').value;
    const attending = this.querySelector('select').value;
    const message = this.querySelector('textarea').value;

    const rsvp = {
        name,
        guests: parseInt(guests),
        attending: attending === 'yes',
        message,
        date: new Date().toISOString()
    };

    rsvpList.push(rsvp);
    localStorage.setItem('weddingRSVP', JSON.stringify(rsvpList));

    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Terima kasih atas konfirmasi kehadiran Anda!';
    this.appendChild(successMessage);

    // Remove success message after 3 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 3000);

    this.reset();
});

// Fix 100vh issue on mobile browsers
function setVHProperty() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setVHProperty);
window.addEventListener('orientationchange', setVHProperty);
setVHProperty();

// Touch-friendly lightbox controls
let touchStartX = 0;
let touchStartY = 0;
let initialTransform = { x: 0, y: 0, scale: 1 };

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isDragging = true;
    }
}

function handleTouchMove(e) {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    
    const img = lightbox.querySelector('img');
    img.style.transform = `translate(${initialTransform.x + deltaX}px, ${initialTransform.y + deltaY}px) scale(${initialTransform.scale})`;
}

function handleTouchEnd() {
    isDragging = false;
    const img = lightbox.querySelector('img');
    const transform = img.style.transform;
    initialTransform = {
        x: parseFloat(transform.match(/translate\((.*?)px/)?.[1] || 0),
        y: parseFloat(transform.match(/,(.*?)px/)?.[1] || 0),
        scale: parseFloat(transform.match(/scale\((.*?)\)/)?.[1] || 1)
    };
}

// Enhance the lightbox initialization
function initLightbox() {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    
    lightboxImg.addEventListener('touchstart', handleTouchStart);
    lightboxImg.addEventListener('touchmove', handleTouchMove);
    lightboxImg.addEventListener('touchend', handleTouchEnd);
    
    // Double tap to zoom
    let lastTap = 0;
    lightboxImg.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 500 && tapLength > 0) {
            const currentScale = initialTransform.scale;
            initialTransform.scale = currentScale === 1 ? 2 : 1;
            initialTransform.x = 0;
            initialTransform.y = 0;
            lightboxImg.style.transform = `translate(0px, 0px) scale(${initialTransform.scale})`;
            e.preventDefault();
        }
        lastTap = currentTime;
    });
}

// Initialize mobile optimizations when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initLightbox();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Optimize background music for mobile
const audioPlayer = document.querySelector('audio');
if (audioPlayer) {
    // Only preload on desktop
    if (window.innerWidth > 768) {
        audioPlayer.preload = 'auto';
    } else {
        audioPlayer.preload = 'none';
    }
    
    // Handle audio context on mobile
    document.addEventListener('touchstart', () => {
        if (audioPlayer.paused) {
            audioPlayer.play().catch(() => {
                // Playback was prevented, show play button
                playButton.style.display = 'block';
            });
        }
    }, { once: true });
}

// Fix 100vh issue on mobile browsers
function setVHVariable() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set the variable initially and on resize/orientation change
window.addEventListener('DOMContentLoaded', setVHVariable);
window.addEventListener('resize', setVHVariable);
window.addEventListener('orientationchange', setVHVariable);

// Fungsi untuk mengatur tinggi viewport yang benar di mobile
function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Update viewport height saat load dan resize
window.addEventListener('load', setViewportHeight);
window.addEventListener('resize', setViewportHeight);

// Perbaikan untuk animasi pintu di mobile
// Fix for iOS vh unit
function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Call setVH on first load and resize
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 100);
});
setVH();

// Prevent bounce scroll on iOS
document.body.addEventListener('touchmove', function(e) {
    if (document.querySelector('.cover-wrapper').style.display !== 'none') {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('DOMContentLoaded', () => {
    const coverWrapper = document.querySelector('.cover-wrapper');
    const leftDoor = document.querySelector('.left-door');
    const rightDoor = document.querySelector('.right-door');
    const openButton = document.querySelector('.open-button');
    const mainContent = document.querySelector('.main-content');
    
    // Force correct height on mobile
    coverWrapper.style.height = `${window.innerHeight}px`;
    
    // Pastikan elemen-elemen sudah dimuat dengan benar
    if (!coverWrapper || !leftDoor || !rightDoor || !openButton || !mainContent) {
        console.error('Some elements are missing');
        return;
    }

    // Set initial states
    mainContent.style.display = 'none';
    document.body.style.overflow = 'hidden';

    openButton.addEventListener('click', () => {
        // Tambahkan class untuk animasi
        leftDoor.classList.add('open-left');
        rightDoor.classList.add('open-right');
        
        // Sembunyikan tombol buka
        openButton.style.opacity = '0';
        
        // Tunggu animasi pintu selesai
        setTimeout(() => {
            // Tampilkan konten utama
            mainContent.style.display = 'block';
            
            // Fade in konten utama
            setTimeout(() => {
                mainContent.classList.add('visible');
                document.body.style.overflow = '';
            }, 100);
            
            // Hapus cover setelah animasi selesai
            setTimeout(() => {
                coverWrapper.style.display = 'none';
            }, 1000);
        }, 2000);
    });

    // Handle audio
    const audioPlayer = document.querySelector('audio');
    const playButton = document.getElementById('playButton');
    
    if (audioPlayer && playButton) {
        playButton.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playButton.textContent = '🎵 Pause Music';
            } else {
                audioPlayer.pause();
                playButton.textContent = '🎵 Play Music';
            }
        });
    }
});

// Optimasi loading gambar untuk galeri
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.photo-item img');
    
    // Intersection Observer untuk lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.src = img.getAttribute('data-src') || img.src;
                
                img.onload = () => {
                    img.style.transition = 'opacity 0.5s ease';
                    img.style.opacity = '1';
                    observer.unobserve(img);
                };
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    // Observe each image
    images.forEach(img => imageObserver.observe(img));

    // Mengatur ulang ukuran gambar saat orientasi berubah
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            const grid = document.querySelector('.photo-grid');
            if (grid) {
                grid.style.opacity = '0';
                setTimeout(() => {
                    grid.style.opacity = '1';
                }, 100);
            }
        }, 100);
    });

    // Tambahkan touch feedback
    const photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach(item => {
        item.addEventListener('touchstart', () => {
            item.style.transform = 'scale(0.98)';
        });

        item.addEventListener('touchend', () => {
            item.style.transform = '';
        });
    });
});

// Image optimization and loading
function optimizeImages() {
    const photoItems = document.querySelectorAll('.photo-item img');
    
    // Create intersection observer for lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    // Start loading the image
                    const tempImage = new Image();
                    tempImage.onload = () => {
                        img.src = tempImage.src;
                        img.style.opacity = '0';
                        requestAnimationFrame(() => {
                            img.style.transition = 'opacity 0.5s ease';
                            img.style.opacity = '1';
                        });
                    };
                    tempImage.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    // Observe each image
    photoItems.forEach(img => {
        if (img.complete) {
            // Image is already loaded
            img.style.opacity = '1';
        } else {
            // Start observing for lazy loading
            imageObserver.observe(img);
            // Add loading state
            img.style.opacity = '0';
            img.addEventListener('load', () => {
                img.style.transition = 'opacity 0.5s ease';
                img.style.opacity = '1';
            });
        }
    });

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            document.querySelectorAll('.photo-item').forEach(item => {
                // Force browser to recalculate layout
                item.style.transform = 'translateZ(0)';
            });
        }, 100);
    });
}

// Initialize image optimization after DOM loads
document.addEventListener('DOMContentLoaded', optimizeImages);

// Animasi saat scroll: fade-in/slide-in section
function animateOnScroll() {
    const elements = document.querySelectorAll('section, .main-content > header, footer');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-on-scroll');
            } else {
                entry.target.classList.remove('show-on-scroll');
            }
        });
    }, {
        threshold: 0.15
    });
    elements.forEach(el => {
        el.classList.add('scroll-animate-init');
        observer.observe(el);
    });
}
document.addEventListener('DOMContentLoaded', animateOnScroll);
