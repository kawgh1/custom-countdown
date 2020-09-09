const music = document.querySelector('audio');
const playBtn = document.getElementById('play');

const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.getElementsByClassName('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

const container = document.getElementById('container');




let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();

let countdownActive;

// local storage object for later reference
let savedCountdown;


const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Minimum with Today's Date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);


// Get all elements with class="closebtn"
const close = document.getElementsByClassName('closebtn');
const alert1 = document.getElementById('alert');

// Check if Playing
let isPlaying = false;




// Play Music
function playSong() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

// Pause Music
function pauseSong() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}



function alertMessage() {
    alert1.hidden = false;

    let i;

    // Loop through all close buttons
    for (i = 0; i < close.length; i++) {
        // When someone clicks on a close button
        close[i].onclick = function () {

            // Get the parent of <span class="closebtn"> (<div class="alert">)
            var div = this.parentElement;

            // Set the opacity of div to 0 (transparent)
            div.style.opacity = "0";

            // Hide the div after 600ms (the same amount of milliseconds it takes to fade out)
            setTimeout(function () {
                alert1.hidden = true;
                alert1.style.opacity = "1";

            }, 600);
        }
    }



    // console.log('alert triggered');

}

// Populate Countdown / Complete UI
function updateDOM() {

    countdownActive = setInterval(() => {

        const now = new Date().getTime(); // millisecond value from 1/1/1970
        const distance = countdownValue - now;

        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);
        // console.log(days, hours, minutes, seconds);

        // Hide Input form
        inputContainer.hidden = true;

        // If countdown has ended, show complete message
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
            container.style.background = 'rgba(255,255,255, 90%)';

        } else {

            // Else, show the countdown in progress

            // Populate Countdown
            countdownElTitle.textContent = `${countdownTitle}`;
            if (countdownElTitle.textContent === '') {
                countdownElTitle.textContent = 'The Final Countdown';
            }
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;


            // Show Countdown
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }



        // update container info every 1 second to show countdown
    }, second);
}

//Take values from Form input
function updateCountdown(e) {
    e.preventDefault(); // prevents form from submitting over the network, just in browser

    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;

    // save countdown as local object
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };


    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    // console.log(countdownTitle, countdownDate);

    // check for valid date
    if (countdownDate === '') {
        alertMessage();
    } else {
        // Get number version of current Date, update DOM
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }



}

// Reset All Values
function reset() {
    // Countdowns, show Input
    countdownEl.hidden = true;
    inputContainer.hidden = false;
    completeEl.hidden = true;
    container.style.background = 'rgba(255,255,255, 50%)';

    // Stop the countdown
    clearInterval(countdownActive);

    // Reset values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown'); // remove saved Countdown if present

}

// Restore local countdown if available
function restorePreviousCountdown() {
    if (localStorage.getItem('countdown')) {

        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;

        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}



// Event Listeners

countdownForm.addEventListener('submit', updateCountdown);

countdownBtn.addEventListener('click', reset);

completeBtn.addEventListener('click', reset);

// Play or Pause Event Listener
playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));



// ON LOAD, CHECK LOCAL STORAGE FOR PREVIOUS COUNTDOWN
restorePreviousCountdown();