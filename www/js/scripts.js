// Global vars
var activePanel = "about";
var playState = "init";
var songs = {};
var currentSong = "";
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = -1;
camera.lookAt(new THREE.Vector3(0,0,0));
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
var channelColors = [
    new THREE.Color('red'),
    new THREE.Color('lightblue'),
    new THREE.Color('yellow'),
    new THREE.Color('purple'),
    new THREE.Color('green'),
    new THREE.Color('orange'),
    new THREE.Color('cyan'),
    new THREE.Color('blue'),
    new THREE.Color('lime'),
    new THREE.Color('fuchsia'),
    new THREE.Color('pink'),
    new THREE.Color('white'),
    new THREE.Color('royalblue'),
    new THREE.Color('tomato'),
    new THREE.Color('beige'),
    new THREE.Color('aqua')
]
var activeNotes = [];
for(var i = 0; i < 16; i++) {
    activeNotes[i] = [];
}


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
    clearScene();
    MIDI.Player.loadFile(songs[name], function() { currentSong = name; changeState("start") });
}

// Reset Scene
function clearScene() {
    while(scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
}

// Start JS things when page ready
$(document).ready( function() {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);

    MIDI.loadPlugin({
        soundfontUrl: "http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/",
		instrument: "acoustic_grand_piano",
        onsuccess: function() {
            for(var i = 0; i < 16; i++) {
                if(i != 9)
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
    $("#visualize").append( renderer.domElement );

    MIDI.Player.addListener(function(data) {
        //var now = data.now;
        //var end = data.end;
        var channel = data.channel;
        var message = data.message;
        var note = data.note;
        var velocity = data.velocity;

        if(message == 144) { // noteOn
            var ptsGeometry = new THREE.Geometry();
            var ptV = new THREE.Vector3();
            ptV.x = (note / 127) - 0.5;
            ptV.y = (velocity / 127) - 0.5;
            ptV.z = 0;
            ptsGeometry.vertices.push( ptV )
            var ptsMaterial = new THREE.PointsMaterial( { size: 0.01, color: channelColors[channel] } )
            var ptObj = new THREE.Points( ptsGeometry, ptsMaterial );
            scene.add( ptObj );
            activeNotes[channel][note] = ptObj;
        } else if(message == 128) { // noteOff
            if(activeNotes[channel][note] == null)
                return;
            scene.remove(activeNotes[channel][note]);
        } else if(message == 123) {
            clearScene();
        }
    });

    animate();
});

    function animate() {
        requestAnimationFrame( animate );
        render();
    }

    function render() {
        renderer.render( scene, camera );
    }