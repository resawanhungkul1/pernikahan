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
const weddingDate = new Date('September 30, 2025 00:00:00').getTime();

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

// Opening Animation
function openInvitation() {
    const leftDoor = document.querySelector('.left-door');
    const rightDoor = document.querySelector('.right-door');
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('mainContent');
    const wrapper = document.querySelector('.cover-wrapper');
    
    // Prevent scrolling during animation
    document.body.style.overflow = 'hidden';
    
    // Ensure proper positioning and perspective
    wrapper.style.perspective = '2000px';
    wrapper.style.perspectiveOrigin = '50% 50%';
    
    // Play music from 47 seconds when opening the invitation
    audio.currentTime = 47;
    audio.play().then(() => {
        isPlaying = true;
        playButton.innerHTML = '♪ Jeda Musik';
    }).catch((error) => {
        console.log("Audio playback failed:", error);
        isPlaying = false;
        playButton.innerHTML = '♪ Putar Musik';
    });

    // Animate the doors
    leftDoor.classList.add('open-left');
    rightDoor.classList.add('open-right');

    // Fade out the cover
    setTimeout(() => {
        cover.style.opacity = '0';
    }, 500);
    
    // Show main content
    mainContent.style.display = 'block';
    setTimeout(() => {
        mainContent.classList.add('visible');
    }, 1000);    // Remove cover and doors after animation, restore scrolling
    setTimeout(() => {
        cover.style.display = 'none';
        document.querySelector('.doors').style.display = 'none';
        document.body.style.overflow = '';
        wrapper.style.perspective = '';
    }, 2500);
}

// Handle comments
let comments = JSON.parse(localStorage.getItem('weddingComments') || '[]');

function displayComments() {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-header">${comment.name}</div>
            <div class="comment-text">${comment.message}</div>
            <div class="comment-date">${new Date(comment.date).toLocaleDateString()}</div>
        `;
        commentsList.appendChild(commentElement);
    });
}

document.getElementById('commentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = this.querySelector('input[type="text"]').value;
    const message = this.querySelector('textarea').value;
    
    const newComment = {
        name,
        message,
        date: new Date().toISOString()
    };
    
    comments.unshift(newComment);
    localStorage.setItem('weddingComments', JSON.stringify(comments));
    
    displayComments();
    this.reset();
});

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playButton.innerHTML = '♪ Putar Musik';
    } else {
        if (audio.currentTime < 47) {
            audio.currentTime = 47;
        }
        audio.play();
        playButton.innerHTML = '♪ Jeda Musik';
    }
    isPlaying = !isPlaying;
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
function setVHVariable() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set the variable initially and on resize/orientation change
window.addEventListener('DOMContentLoaded', setVHVariable);
window.addEventListener('resize', setVHVariable);
window.addEventListener('orientationchange', setVHVariable);
