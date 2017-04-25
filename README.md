# IGME-230 Project 4

I plan to make JS-based MIDI player. Instead of having three separate pages, there will be one “app” with three panels that switch out. This project will be done without a partner. The MIDI playing will be done using MIDI.js.

![Piano Roll view](https://github.com/ctm2142/igme230-proj4/PianoRoll.png)
This is the piano roll view. The notes will scroll across the screen like in Synthesia. Also, you can Solo one of the MIDI tracks (only graphically, it will still play sound). I haven’t quite figured out how I’m doing to delay between reading the note and playing it, but I will assume that there is something in the MIDI.js API that will let me do that (I haven’t had a chance to look at it in-depth yet). This will probably be done with Processing.

![Visualizatio view](https://github.com/ctm2142/igme230-proj4/Visualize.png)
This is the visualization view. This will be using three.js to create particle effects that look cool. I have a rough idea of what this will look like, but it’s not finalized yet. You will also be able to look around in the space, as it is 3D.

![Playlist view](https://github.com/ctm2142/igme230-proj4/Playlist.png)
Playlist view. Has server-provided MIDI files (left column) and “uploaded” files (right column) (uploaded in quotes b/c JS will intercept, so not really uploading). Has generic play/pause buttons, which will be SVG. The nav bar (which will also be on the other panels, I just forgot to draw it in) will have the “links” to the panels in order of: Playlist, Piano Roll, [control buttons], Visualize, About.

The about panel will just be the general info, a floating box of text (not very exciting…)
