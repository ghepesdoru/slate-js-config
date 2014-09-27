slate-js-config
===============

My own slate java script configuration ~/.slate.js

If you are a long time Linux/Windows user and switched to Mac OS, the window manager might seem a bit weak in window positioning. For this reason theare are countless solutions, some paid, some free, and there is [Slate] (https://github.com/jigish/slate).

The advantage of binding your own keys to java script described actions in a os that does not offer a fast and painless way to win + left / win + right to put windows side to side is great. Being used to fully utilize the real estate of each of my monitors, I took the time to set up a configuration that feats me.

Maybe it will be usefull to others also.

Install
=======
Follow the steps illustrated at [Slate] (https://github.com/jigish/slate) github repository to install Slate. Download this profile and create a new file named .slate.js in your User's home directory. Paste in the contents of the profile, and enjoy.


Default Bindings
================
Movement
--------
**Control + Option + Command + Left**
```
Moves the focused window to the left for 5% of the screen size
```
**Control + Option + Command + Right**
```
Moves the focused window to the right for 5% of the screen size
```
**Control + Option + Command + Up**
```
Moves the focused window up for 5% of the screen size
```
**Control + Option + Command + Down**
```
Moves the focused window down for 5% of the screen size
```

Smooth Resizing
---------------
**Control + Option + Right**
```
Extends the focused window's width with 5% of the screen size
```
**Control + Option + Down**
```
Extends the focused window's height with 5% of the screen size
```

Smooth Srinking
---------------
**Control + Option + Up**
```
Shrinks the focused window's height with 5% of the screen size
```
**Control + Option + Left**
```
Shrinks the focused window's width with 5% of the screen size
```

Positioning and scale
---------------------
**Control + Command + Left**
```
Moves any window smaller then half of the screen width to the left:
 - small window at the right of the screen will be aligned to the middle of the screen and resized to half of the screen's width on repeat
 - small window at left of the screen will be aligned to left and resized to half of the screen's width on repeat
 - half of screen window at right will be moved to the left half screen
 - half of screen window at left will have it's width reduced to half, reverted by repeating
 - minimizez and repositions full width windows to the left half of the screen
```

**Control + Command + Right**
```
Moves any window smaller then half of the screen width to the right:
 - small window at the left of the screen will be aligned to the middle of the screen and resized to half of the screen's width on repeat
 - small window at right of the screen will be aligned to right and resized to half of the screen's width on repeat
 - half of screen window at left will be moved to the right half screen
 - half of screen window at right will have it's width extended to the width of the screen, reverted by repeating
 - minimizez and repositions full width windows to the right half of the screen
```

**Control + Command + Up**
```
Moves any window smaller then half of the screen's height up:
 - small window at the bottom of the screen will be aligned to the middle of the screen and resized to half of the screen's height on repeat
 - small window at top of the screen will be aligned to top and resized to half of the screen's height on repeat
 - half of screen window at bottom will be moved to the upper half screen
 - half of screen window at top will have it's height extended to the screens height, reverted by repeating
 - minimizez and repositions full height windows to the top half of the screen
```

**Control + Command + Down**
```
Moves any window smaller then half of the screen's height up:
 - small window at the top of the screen will be aligned to the middle of the screen and resized to half of the screen's height on repeat
 - small window at bottom of the screen will be aligned to bottom and resized to half of the screen's height on repeat
 - half of screen window at top will be moved to the bottom half screen
 - half of screen window at bottom will have it's height reduced to half, reverted by repeating
 - minimizez and repositions full height windows to the bottom half of the screen
```
