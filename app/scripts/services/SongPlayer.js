(function() {

	 function SongPlayer($rootScope, Fixtures) {
	     var SongPlayer = {};

 /**
 * @desc current album the current song is sourced from
 * @type {Object}
 */	
	     var currentAlbum = Fixtures.getAlbum();
 /**
 * @desc Buzz object audio file
 * @type {Object}
 */	     
	     var currentBuzzObject = null;

 /**
 * @function setSong
 * @desc Stops currently playing song and loads new audio file as currentBuzzObject
 * @param {Object} song
 */
		 var setSong = function(song) {
		    if (currentBuzzObject) {
		    	stopSong(SongPlayer.currentSong)
		    }
		 
		    currentBuzzObject = new buzz.sound(song.audioUrl, {
		        formats: ['mp3'],
		        preload: true
		    });

		    currentBuzzObject.bind('timeupdate', function() {
		         $rootScope.$apply(function() {
		             SongPlayer.currentTime = currentBuzzObject.getTime();
		         });
		    });		    
		 
		    SongPlayer.currentSong = song;
		 };

	    var setArtist = function(song) {
	    	song.artist = currentAlbum.artist
	    }

 /**
 * @function playSong
 * @desc Plays the song object and sets the song.playing property to true
 * @param {Object} song
 */
		 var playSong = function(song) {
		 	currentBuzzObject.play();
		 	song.playing = true;
		 };

		var getSongIndex = function(song) {
		     return currentAlbum.songs.indexOf(song);
		 };

		 var stopSong = function(song) {
		 	currentBuzzObject.stop();
		 	song.playing = null;
		 }

/**
* @desc Active song object from list of songs
* @type {Object}
*/
	     SongPlayer.currentSong = null;
	     SongPlayer.currentTime = null;
	     SongPlayer.volume = 75;


	     SongPlayer.play = function(song) {
		     song = song || SongPlayer.currentSong;

	         if (SongPlayer.currentSong !== song) {
	         	 setSong(song);
	         	 setArtist(song);
	         	 playSong(song);
	         	 console.log("playing")

		     } else if (SongPlayer.currentSong === song) {
		         if (currentBuzzObject.isPaused()) {
		         	playSong(song);
		             console.log("playing again")
		         }
		         console.log("not paused, gonna play")
		     } 
	     };

	     SongPlayer.pause = function(song) {
	     	song = song || SongPlayer.currentSong;
	     	currentBuzzObject.pause();
	     	// song.playing = false;
	     	song.playing = null;
	     	console.log("pausing!")
	     }

		 SongPlayer.previous = function() {
		     var currentSongIndex = getSongIndex(SongPlayer.currentSong);
		     currentSongIndex--;

		     if (currentSongIndex < 0) {
		         stopSong(SongPlayer.currentSong);
		     } else {
		         var song = currentAlbum.songs[currentSongIndex];
		         setSong(song);
		         setArtist(song);
		         playSong(song);
		     }
		 };

		 SongPlayer.next = function() {
		     var currentSongIndex = getSongIndex(SongPlayer.currentSong);
		     currentSongIndex++;

		     if (currentSongIndex >= currentAlbum.songs.length) {
		     	stopSong(SongPlayer.currentSong);
		     } else {
		         var song = currentAlbum.songs[currentSongIndex];
		         setSong(song);
		         setArtist(song);
		         playSong(song);
		     }
		 };

		 SongPlayer.setVolume = function(volume) {
		 	if (currentBuzzObject) {
		 		currentBuzzObject.setVolume(volume);
		 	}

		 }

		 SongPlayer.setCurrentTime = function(time) {
		     if (currentBuzzObject) {
		         currentBuzzObject.setTime(time);
		     }
	     }


	     return SongPlayer;
	 }


	angular
		.module('blocJams')
		.factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]); 
})();
