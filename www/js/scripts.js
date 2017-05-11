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
    var files = evt.target.files;
    for (var i = 0, f; f = files[i]; i++) {
        if (!f.type.match('audio.midi')) {
            alert("Only MIDI files are allowed");
            continue;
        }
        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                if(songs[escape(theFile.name)]) return;
                songs[escape(theFile.name)] = e.target.result;
                $("#playlist-list").append("<div class=\"playlist-list-item\" onclick=\"playSong('" + escape(theFile.name) + "')\"><span class=\"fa fa-play-circle\"></span> " + escape(theFile.name) + "</div>");
            };
        })(f);
        reader.readAsDataURL(f);
    }
}

// Time formatting for controls
function timeFormatting(n) {
    var minutes = n / 60 >> 0;
    var seconds = String(n - (minutes * 60) >> 0);
    if (seconds.length == 1) seconds = "0" + seconds;
    return minutes + ":" + seconds;
};

// Some stuff for cleaner play/pause
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

// Start a new song
function playSong(name) {
    MIDI.Player.loadFile(songs[name], function() { currentSong = name; changeState("start") });
}

// Start JS things when page ready
$(document).ready( function() {
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
        var now = data.now >> 0;
        var end = data.end >> 0;
        if (now === end) {
            changeState("end");
        }
        $("#control-time").text(timeFormatting(now) + " / " + timeFormatting(end));
        $("#control-timeline-completed").css('width', (percent * 500) + "px");
	});

    // Visualization
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    $("#visualize").append( renderer.domElement );
});