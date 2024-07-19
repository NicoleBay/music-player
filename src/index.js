const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

const allSongs = [
  {
    id: 0,
    title: "Scratching The Surface",
    artist: "Quincy Larson",
    duration: "4:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3",
  },
  {
    id: 1,
    title: "Can't Stay Down",
    artist: "Quincy Larson",
    duration: "4:15",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3",
  },
  {
    id: 2,
    title: "Still Learning",
    artist: "Quincy Larson",
    duration: "3:51",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3",
  },
  {
    id: 3,
    title: "Cruising for a Musing",
    artist: "Quincy Larson",
    duration: "3:34",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cruising-for-a-musing.mp3",
  },
  {
    id: 4,
    title: "Never Not Favored",
    artist: "Quincy Larson",
    duration: "3:35",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/never-not-favored.mp3",
  },
  {
    id: 5,
    title: "From the Ground Up",
    artist: "Quincy Larson",
    duration: "3:12",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/from-the-ground-up.mp3",
  },
  {
    id: 6,
    title: "Walking on Air",
    artist: "Quincy Larson",
    duration: "3:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/walking-on-air.mp3",
  },
  {
    id: 7,
    title: "Can't Stop Me. Can't Even Slow Me Down.",
    artist: "Quincy Larson",
    duration: "3:52",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cant-stop-me-cant-even-slow-me-down.mp3",
  },
  {
    id: 8,
    title: "The Surest Way Out is Through",
    artist: "Quincy Larson",
    duration: "3:10",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/the-surest-way-out-is-through.mp3",
  },
  {
    id: 9,
    title: "Chasing That Feeling",
    artist: "Quincy Larson",
    duration: "2:43",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/chasing-that-feeling.mp3",
  },
];

// Create a new HTML5 audio element
const audio = new Audio();

// a copy to shuffle and delete songs
let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

//functionality for playing the displayed songs
const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id); //This will iterate through the userData?.songs array, searching for a song that corresponds to the id passed into the playSong function.
  audio.src = song.src; //audio element where to find the audio data for the selected song
  audio.title = song.title; //audio element what to display as the title of the song
  //check if no current song is playing or if the current song is different from the one that is about to be played
  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime; //resume the current song at the point where it was paused
  }
  //update the current song being played as well as the appearance of the playButton element.
  userData.currentSong = song;
  playButton.classList.add("playing");
  audio.play();
};

//functionality for pausing the displayed songs
const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  playButton.classList.remove("playing");
  audio.pause();
};

/* 
const printGreeting = () => {
  //arrow function expression
  console.log("Hello there!");
};

printGreeting();

const printMessage = (org) => {
  arrow function expression with org as parameter
  console.log(`${org} is awesome!`);
};

printMessage("freeCodeCamp");

const addTwoNumbers = (num1, num2) => num1 + num2; arrow function expression with num1 and num2 as parameters */

//  pausing the currently playing song
const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
};

//next song and the previous song
const playNextSong = () => {
  if (userData?.currentSong === null) {
    //check if there's no current song playing in the userData object
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData?.songs[currentSongIndex + 1];
    playSong(nextSong.id);
  }
};

const playPreviousSong = () => {};

const renderSongs = (array) => {
  const songsHTML = array
    .map((song) => {
      return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
<span class="playlist-song-artist">${song.artist}</span>
<span class="playlist-song-duration" >${song.duration}</span>
      </button>
      <button class="playlist-song-delete" aria-label="Delete ${song.title}"><svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg></button>
      </li>
      `;
    })
    .join(""); // Chain the join() method with an empty string as the separator
  playlistSongs.innerHTML = songsHTML; // insert the li element into the ul element in the already provided HTML file
};

//index of each song in the songs property of userData
const getCurrentSongIndex = () => {
  return userData?.songs.indexOf(userData?.currentSong); //returns the first index at which a given element can be found in the array
};

//play button so that it will play the current song when it is clicked on
playButton.addEventListener("click", () => {
  if (!userData?.currentSong === null) {
    //if to check if userData?.currentSong is falsey
    playSong(userData?.songs[0].id); //ensure the first song in the playlist is played first
  } else {
    playSong(userData?.currentSong.id); //ensures that the currently playing song will continue to play when the play button is clicked
  }

  audio.play();
});

// Call renderSongs to display the initial playlist
renderSongs(userData?.songs);

//pause button
pauseButton.addEventListener("click", pauseSong);
//next button
nextButton.addEventListener("click", playNextSong);

//display songs in alphabetical order
const sortSongs = () => {
  userData?.songs.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0; //leave the order of the two elements unchanged
  });
};

renderSongs(sortSongs()); //change roder of songs
