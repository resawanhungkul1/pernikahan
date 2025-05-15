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
    }, 1000);

    // Remove cover and doors after animation
    setTimeout(() => {
        cover.style.display = 'none';
        document.querySelector('.doors').style.display = 'none';
    }, 2000);
}

// Handle comments
document.getElementById('commentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = this.querySelector('input[type="text"]').value;
    const message = this.querySelector('textarea').value;
    
    // Create new comment element
    const comment = document.createElement('div');
    comment.className = 'comment';
    comment.innerHTML = `
        <div class="comment-header">${name}</div>
        <div class="comment-text">${message}</div>
    `;
    
    // Add to comments list
    document.getElementById('commentsList').prepend(comment);
    
    // Reset form
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
document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your RSVP!');
    this.reset();
});
