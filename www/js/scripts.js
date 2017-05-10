// Global vars
var activePanel = "about";
var playState = "init";
var songs = {};
var currentSong = "";

// Panel changing
function changePanel(name) {
    activePanel = name;
    $(".panel").hide();
    $(".panel#" + name).show();
    $("nav a.active").removeClass("active");
    $("nav a.link-" + name).addClass("active");
}

// File Uploading
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('audio.midi')) {
            alert("Only MIDI files are allowed");
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                if(songs[escape(theFile.name)]) return;
                songs[escape(theFile.name)] = e.target.result;
                $("#playlist-list").append("<div class=\"playlist-list-item\" onclick=\"playSong('" + escape(theFile.name) + "')\"><span class=\"fa fa-play-circle\"></span> " + escape(theFile.name) + "</div>");
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}

function timeFormatting(n) {
    var minutes = n / 60 >> 0;
    var seconds = String(n - (minutes * 60) >> 0);
    if (seconds.length == 1) seconds = "0" + seconds;
    return minutes + ":" + seconds;
};

function changeState(state) {
    if(state == playState) {
        return;
    } else if(state == "start") {
        playState = "play";
        MIDI.Player.start();
        $("#play-btn").hide();
        $("#pause-btn").show();
    } else if(state == "end") {
        playState = "stop";
        $("#play-btn").show();
        $("#pause-btn").hide();
    } else if(state == "play") {
        if(playState == "pause") {
            MIDI.Player.resume();
        } else {
            if(currentSong == "") {
                alert("Please select a song from the playlist");
                return;
            } else {
                playSong(currentSong);
            }
        }
        playState = "play";
        $("#play-btn").hide();
        $("#pause-btn").show();
    } else if(state == "pause") {
        playState = "pause";
        MIDI.Player.pause();
        $("#play-btn").show();
        $("#pause-btn").hide();
    }
}

function playSong(name) {
    MIDI.Player.loadFile(songs[name], function() { currentSong = name; changeState("start") });
}

$(document).ready( function() {
    console.log("Document Ready");
    document.getElementById('files').addEventListener('change', handleFileSelect, false);

    MIDI.loadPlugin({
        soundfontUrl: "http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/",
		instrument: "acoustic_grand_piano",
        onsuccess: function() {
            for(var i = 0; i < 16; i++) {
                MIDI.programChange(i, 0);
            }
        }
    });

   MIDI.Player.setAnimation(function(data, element) {
        var percent = data.now / data.end;
        var now = data.now >> 0; // where we are now
        var end = data.end >> 0; // end of song
        if (now === end) { // go to next song
            /*
            var id = ++songid % song.length;
            player.loadFile(song[id], player.start); // load MIDI
            */
            changeState("end");
        }
        // display the information to the user
        $("#control-time").text(timeFormatting(now) + " / " + timeFormatting(end));
	});
});