// select the elements from the DOM in the HTML file
// DOM elements
const wrapper = document.querySelector(".wrapper");
const repeatBtn = wrapper.querySelector("#repeat-plist");
const ulTag = wrapper.querySelector("ul");
var musicImg = wrapper.querySelector(".img-area img");
var musicName = wrapper.querySelector(".song-details .name");
var musicArtist = wrapper.querySelector(".song-details .artist");
var mainAudio = wrapper.querySelector("#main-audio");
var playPauseBtn = wrapper.querySelector(".play-pause");
var prevBtn = wrapper.querySelector("#prev");
var nextBtn = wrapper.querySelector("#next");
var progressBar = wrapper.querySelector(".progress-bar");
var progressArea = wrapper.querySelector(".progress-area");
var musicList = wrapper.querySelector(".music-list");
var showMoreBtn = wrapper.querySelector("#more-music");
var hideMusicBtn = musicList.querySelector("#close"); // select wrapper, music-list classes, and select close id

// Variables (no. of songs)
// Shuffle song when the page is loaded
var musicIndex = Math.floor(Math.random() * allMusic.length + 1);

// Event listener to load the music when the window is loaded
window.addEventListener("load", () => {
  // Load a music
  loadMusic(musicIndex);
  playingNow();
});

// Event listener to play the music
playPauseBtn.addEventListener("click", () => {
  // validate if the music is playing or not
  const isMusicPause = wrapper.classList.contains("paused");
  // if the music is paused then play the music
  isMusicPause ? pauseMusic() : playMusic();
});

// Event listner to play the next music
nextBtn.addEventListener("click", () => {
  nextMusic();
});

//  Event listner to play the previous music
prevBtn.addEventListener("click", () => {
  prevMusic();
});

// Event listner to Update progress bar of each music
mainAudio.addEventListener("timeupdate", (e) => {
  // Get the current time and duration of the music
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;

  // Calculate the progress value and update the progress bar
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  // Update the music current time and duration
  let musicCurrentTime = wrapper.querySelector(".current");

  ///////// Update current time/////////
  let currentHrs = Math.floor(currentTime / 3600);
  // The fraction of hrs is min
  let currentMin = Math.floor((currentTime % 3600) / 60);
  // The fraction of min is sec
  let currentSec = Math.floor(currentTime % 60);

  // Validate if the time is less than 10
  currentSec < 10 ? (currentSec = `0${currentSec}`) : currentSec;
  currentMin < 10 ? (currentMin = `0${currentMin}`) : currentMin;

  // Validate hour format and display the time
  if (currentHrs == 0) {
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
  } else {
    musicCurrentTime.innerText = `${currentHrs}:${currentMin}:${currentSec}`;
  }

  // Update the music current time and duration
  mainAudio.addEventListener("loadeddata", () => {
    let musicDurationTime = wrapper.querySelector(".duration");
    //////////// Update the music duration////////
    let audioDuration = mainAudio.duration;
    // Convert time for mat to Hrs:Min:Sec
    let totalHrs = Math.floor(audioDuration / 3600);
    // The fraction of hrs is min
    let totalMin = Math.floor((audioDuration % 3600) / 60);
    // The fraction of min is sec
    let totalSec = Math.floor(audioDuration % 60);

    // Validate if the time is less than 10
    totalSec < 10 ? (totalSec = `0${totalSec}`) : totalSec;
    totalMin < 10 ? (totalMin = `0${totalMin}`) : totalMin;

    // Validate hour format and display the time
    if (totalHrs === 0) {
      musicDurationTime.innerText = `${totalMin}:${totalSec}`;
    } else {
      musicDurationTime.innerText = `${totalHrs}:${totalMin}:${totalSec}`;
    }
  });
});

// Event to update the currrent time regarding the progress bar width
progressArea.addEventListener("click", (e) => {
  // Get the width of the progress bar
  let progressWidthval = progressArea.clientWidth;
  // Get the clicked position
  let clickedOffSetX = e.offsetX;
  let songDuration = mainAudio.duration;

  // Set a new current time of the music
  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
  playMusic();
});

// Event to toggle the repeat button, shuffle button, and playlist loop
repeatBtn.addEventListener("click", () => {
  // Get the innerText of the icon
  let getText = repeatBtn.innerText;
  // Validate the innerText
  if (getText === "repeat") {
    repeatBtn.innerText = "repeat_one";
    repeatBtn.setAttribute("title", "Song looped");
  } else if (getText === "repeat_one") {
    repeatBtn.innerText = "shuffle";
    repeatBtn.setAttribute("title", "Playback shuffle");
  } else if (getText === "shuffle") {
    repeatBtn.innerText = "repeat";
    repeatBtn.setAttribute("title", "Playlist looped");
  }
});

// Event to repeat the music when it ends
mainAudio.addEventListener("ended", () => {
  // Get the innerText of the icon
  let getText = repeatBtn.innerText;

  // Validate the innerText
  if (getText === "repeat") {
    // Play next song when the current music ends
    nextMusic();
  } else if (getText === "repeat_one") {
    // Repeat the current music when it ends
    mainAudio.currentTime = 0;
    loadMusic(musicIndex);
    playMusic();
  } else if (getText === "shuffle") {
    let randIndex = Math.floor(Math.random() * allMusic.length + 1);
    // Loop until the next music is different from the current music
    do {
      randIndex = Math.floor(Math.random() * allMusic.length + 1);
    } while (musicIndex == randIndex);

    // Set the new music index
    musicIndex = randIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
  }
});

// Event to show the music list
showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

// Event to hide the music list
hideMusicBtn.addEventListener("click", () => {
  musicList.classList.remove("show"); // remove the show class from the music list
});

////////////////////////// Create a function object to create the music list////////////////////////
allMusic.forEach((music, i) => {
  // loop through the allMusic array
  let liTag = `<li li-index="${i + 1}">
    <div class="row">
      <span>${music.name}</span>
      <p>${music.artist}</p>
    </div>
    <audio class="${music.src}" src="assets/songs/${music.src}.mp3"></audio>
    <span id="${music.src}" class="audio-duration">0:00</span>
  </li>`;

  // Append the liTag to the ulTag
  ulTag.insertAdjacentHTML("beforeend", liTag);

  // Get the audio duration by selecting class in the audio tag
  let liAudioDuration = ulTag.querySelector(`#${music.src}`);
  let liAudioTag = ulTag.querySelector(`.${music.src}`);

  // Load dudation
  liAudioTag.addEventListener("loadeddata", () => {
    //////////// Update the music duration////////
    let audioDuration = liAudioTag.duration;
    let totalHrs = Math.floor(audioDuration / 3600);
    let totalMin = Math.floor((audioDuration % 3600) / 60);
    let totalSec = Math.floor(audioDuration % 60);

    // Validate if the time is less than 10
    totalSec < 10 ? (totalSec = `0${totalSec}`) : totalSec;
    totalMin < 10 ? (totalMin = `0${totalMin}`) : totalMin;

    // Validate hour format and display the time
    if (totalHrs === 0) {
      liAudioDuration.innerText = `${totalMin}:${totalSec}`;
      // adding new attribute to the audio duration
      liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    } else {
      // adding new attribute to the audio duration

      liAudioDuration.innerText = `${totalHrs}:${totalMin}:${totalSec}`;
      liAudioDuration.setAttribute(
        "t-duration",
        `${totalHrs}:${totalMin}:${totalSec}`
      );
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to play the music
function playMusic() {
  wrapper.classList.add("paused");
  // Change the icon to pause
  playPauseBtn.querySelector("i").innerText = "pause";
  // play the music
  mainAudio.play();
}

// Function to pause the music
function pauseMusic() {
  wrapper.classList.remove("paused");
  // Change the icon to play
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  // pause the music
  mainAudio.pause();
}

// Function to load musics from the allMusic array in music-list.js
function loadMusic(indexNum) {
  // Add the music name, img, and artist by accessing the allMusic array
  musicName.innerText = allMusic[indexNum - 1].name;
  musicArtist.innerText = allMusic[indexNum - 1].artist;
  musicImg.src = `assets/img/${allMusic[indexNum - 1].img}.jpg`;
  mainAudio.src = `assets/songs/${allMusic[indexNum - 1].img}.mp3`;
}

// Function to play the next music
function nextMusic() {
  // Increment the musicIndex
  musicIndex++;

  // Validate musicIndex
  if (musicIndex > allMusic.length) {
    musicIndex = 1;
  }
  // Call the loadMusic and playMusic function
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

// Function to play the prev music
function prevMusic() {
  // Decrement the musicIndex
  musicIndex--;

  // Validate musicIndex
  if (musicIndex < 1) {
    musicIndex = allMusic.length;
  }

  // Call the loadMusic and playMusic function
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

// Function to check the current music playing
const allliTags = ulTag.querySelectorAll("li");
function playingNow() {
  allliTags.forEach((liTag) => {
    let audioTag = liTag.querySelector(".audio-duration");

    // validate if the liTag is playing or not
    if (liTag.classList.contains("playing")) {
      liTag.classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    // Get the liTag index
    if (liTag.getAttribute("li-index") == musicIndex) {
      liTag.classList.add("playing");
      audioTag.innerText = "Playing";
    }

    //Add ing onclick attribute to each liTag
    liTag.setAttribute("onclick", "clicked(this)");
  });
}

/// Function to select a music in the list
function clicked(element) {
  // get the liTag index
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
