# IGME-230 Project 4

## End Project

While doing this project I had to revise a couple things. The main idea, a MIDI music player, stayed the same, and I still used MIDI.js. However, the visualizations ended up a little different.

The Playlist view got slightly simplified. I removed the server-side part of the listings, and the nav was shrunk in width. I also changed the play/pause icons to Font Awesome instead of plain SVG for simplicity. Otherwise the playlist and nav are the same.

![Playlist view](https://github.com/ctm2142/igme230-proj4/raw/master/Playlist.png)

The Piano Roll view got changed to just a Piano View since I couldn't implement the "roll" part of it. MIDI.js did not have a way I could "look ahead" in the notes (or at least not something I found), so I had to go with something similar to vanBasco's Karaoke Player. This means that I have a number of pianos, but no scrolling notes. This is using p5.js, which is the official Processing JS version. I also dropped the idea of soloing tracks for simplicity.

![Piano Roll view](https://github.com/ctm2142/igme230-proj4/raw/master/PianoRoll.png)

The visualization turned out pretty much how I had designed it, with dots created by Three.JS. Unfortunately the dots are small, and since MIDI files are frequently made w/o dynamics it can be rather boring sometimes. I did manage to dig up a MIDI file w/ multiple dynamics, and while it can still be a little dull, it's much more interesting. Definitely room for future improvements here.

![Visualizatio view](https://github.com/ctm2142/igme230-proj4/raw/master/Visualize.png)

Graphics things:
* Time bar is SVG w/ JS (to be honest it's pretty lazy, but it works)
* Piano View is canvas using p5.js
* Visualize is canvas using Three.JS

Above & Beyond:
* MIDI.js
* Managing to make two different graphics libraries work on the same page (heh... heh... that was fun... not...)
* File "uploading" via JS (uploading in quotes b/c it doesn't actually get sent to the server)

Number of browser crashes: somewhere between two and three dozen

## Original Plan

I plan to make JS-based MIDI player. Instead of having three separate pages, there will be one “app” with three panels that switch out. This project will be done without a partner. The MIDI playing will be done using MIDI.js.

![Piano Roll view](https://github.com/ctm2142/igme230-proj4/raw/master/PianoRoll.png)

This is the piano roll view. The notes will scroll across the screen like in Synthesia. Also, you can Solo one of the MIDI tracks (only graphically, it will still play sound). I haven’t quite figured out how I’m doing to delay between reading the note and playing it, but I will assume that there is something in the MIDI.js API that will let me do that (I haven’t had a chance to look at it in-depth yet). This will probably be done with Processing.

![Visualizatio view](https://github.com/ctm2142/igme230-proj4/raw/master/Visualize.png)

This is the visualization view. This will be using three.js to create particle effects that look cool. I have a rough idea of what this will look like, but it’s not finalized yet. You will also be able to look around in the space, as it is 3D.

![Playlist view](https://github.com/ctm2142/igme230-proj4/raw/master/Playlist.png)

Playlist view. Has server-provided MIDI files (left column) and “uploaded” files (right column) (uploaded in quotes b/c JS will intercept, so not really uploading). Has generic play/pause buttons, which will be SVG. The nav bar (which will also be on the other panels, I just forgot to draw it in) will have the “links” to the panels in order of: Playlist, Piano Roll, [control buttons], Visualize, About.

The about panel will just be the general info, a floating box of text (not very exciting…)
