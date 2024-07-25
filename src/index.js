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
  //calls:
  setPlayButtonAccessibleText();
  setPlayerDisplay();
  highlightCurrentSong();
  audio.play();
};

//functionality for pausing the displayed songs
const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  playButton.classList.remove("playing");
  audio.pause();
};

//next song
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

//previous song
const playPreviousSong = () => {
  if (userData?.currentSong === null)
    return; // Check if there is no current song playing
  else {
    // If a song is currently playing, get the index of the current song
    const currentSongIndex = getCurrentSongIndex(); //// The currentSongIndex can now be used to find the previous song in the playlist
    const previousSong = userData?.songs[currentSongIndex - 1];
    playSong(previousSong.id);
  }
};

//shuffle songs and performing necessary state management updates after the shuffling
const shuffle = () => {
  userData?.songs.sort(() => Math.random() - 0.5); //randomize an array (subtract 0.5 from Math.random() which produces random values that are either positive or negative)
  userData.currentSong = null;
  userData.songCurrentTime = 0;
  //calls:
  renderSongs(userData?.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
};

//delete functionality for the playlist
//This would manage the removal of a song from the playlist, handle other related actions when a song is deleted, and create a Reset Playlist button
const deleteSong = (id) => {
  //check if the song is currently playing. If it is, you need to pause the song and play the next song in the playlist
  if (userData?.currentSong?.id === id) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    pauseSong(); //stop the playback
    setPlayerDisplay(); //update the player display
  }
  userData.songs = userData?.songs.filter((song) => song.id !== id); // Remove the song with the specified id from the userData.songs array
  //calls:
  renderSongs(userData?.songs); // displays the modified playlist
  highlightCurrentSong(); //highlight the current song if there is any
  setPlayButtonAccessibleText(); //update the play button's accessible text
  if (userData?.songs.length === 0) {
    //check if the playlist is empty
    const resetButton = document.createElement("button"); //create a resetButton element and a text for it
    const resetText = document.createTextNode("Reset Playlist"); //assign it a text
    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";
    resetButton.appendChild(resetText); //added as a child
    playlistSongs.appendChild(resetButton); //added as a child
    resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs]; //reset the playlist to its original state, spread allSongs into an array and assign it to userData.songs
      renderSongs(sortSongs()); //render the songs again in alphabetical order
      setPlayButtonAccessibleText(); //play button's accessible text
      resetButton.remove(); //Remove the reset button from the playlist}); //reset functionality
    });
  }
};

//display the current song title and artist in the player display
const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  // Access the current song's title and artist from userData
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;
  // Update the song title and artist elements with the current song's information
  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

//currently playing song highlighted in the playlist
const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );

  //remove the attribute
  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });

  //add the attribute back to the currently playing song
  if (songToHighlight) {
    songToHighlight.setAttribute("aria-current", "true");
  }
};

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
      <button class="playlist-song-delete" aria-label="Delete ${song.title}" onclick="deleteSong(${song.id})"><svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg></button>
      </li>
      `;
    })
    .join(""); // Chain the join() method with an empty string as the separator
  playlistSongs.innerHTML = songsHTML; // insert the li element into the ul element in the already provided HTML file
};

//play button describes the current song or the first song in the playlist
const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0]; //get first song
  playButton.setAttribute(
    "aria-label",
    song?.title ? `Play ${song.title}` : "Play"
  ); // attribute named "aria-label". Using a ternary, set the attribute value to Play ${song.title} or "Play" if song?.title is not available.
};

//index of each song in the songs property of userData
const getCurrentSongIndex = () =>
  userData?.songs.indexOf(userData?.currentSong);
//returns the first index at which a given element can be found in the array

//play button so that it will play the current song when it is clicked on
playButton.addEventListener("click", () => {
  if (userData?.currentSong === null) {
    //if to check if userData?.currentSong is falsey
    playSong(userData?.songs[0].id); //ensure the first song in the playlist is played first
  } else {
    playSong(userData?.currentSong.id); //ensures that the currently playing song will continue to play when the play button is clicked
  }
});

//pause button
pauseButton.addEventListener("click", pauseSong);
//next button
nextButton.addEventListener("click", playNextSong);
//previous button
previousButton.addEventListener("click", playPreviousSong);
//shuffle button
shuffleButton.addEventListener("click", shuffle);
//play next song automatically
audio.addEventListener("ended", () => {
  const currentSongIndex = getCurrentSongIndex(); //check if there is a next song to play
  const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;
  if (nextSongExists) {
    //automatically play the next song when the current song ends
    playNextSong();
  } else {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    //call:  to correctly update the player
    pauseSong();
    setPlayerDisplay();
    highlightCurrentSong();
    setPlayButtonAccessibleText();
  }
});

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
  return userData?.songs;
};

renderSongs(sortSongs()); //change roder of songs
setPlayButtonAccessibleText();
