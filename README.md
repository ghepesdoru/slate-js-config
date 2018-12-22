slate-js-config
===============

If you are a long time Linux/Windows user and switched to Mac OS, the window manager might seem a bit weak in window positioning. For this reason theare are countless solutions, some paid, some free, and there is [Slate] (https://github.com/jigish/slate).

If you are interested in a 1080p version of the configuration, please check the [v1](https://github.com/ghepesdoru/slate-js-config/tree/v1). It has more bindings by default and allows fine tunning of 
windows. V1 only support 2 columns/screen and won't work well in a ultrawide or huge 4k display scenario.

Unlike v1, **v2 adds ultrawide support** by allowing to define the desired configuration of columns and rows for each resolution. Custom resolutions support is there also; the implementation is not quadrant dependent, and should teoretically allow any screen configurations.

Install
=======
Follow the steps illustrated at [Slate](https://github.com/jigish/slate) github  repository to install Slate. Download this profile and create a new file named .slate.js in your User's home directory. Paste in the contents of the profile, and enjoy.

Usage
=====
If you want to test my configuration, you can do so by copying the dist/slate.js file directly to your home directory and restarting Slate.

Customisation/Extension
=======================
If you want to modify the bindings, add new resolutions etc, fell free to do so by clonsing the repository followed by a **npm install** and **npm build**. For fast testing **npm build-test** is also available and will copy the resulting slate.js configuration to your home directory.

Fell free to create a pull request with your modifications and we can arange a merge for everyone else to benefit of your changes.


Default Bindings
================

Positioning and scale
---------------------
  **Control + Command + Left/Right/Down/Up/Up-Left/Down-Left etc**: moves the window to the desired direction(s) following a set of defined rules:

- If the window is smaller then a row/column specified for the screen's resolution it will fill the asignated space
- If the window is bigger or equal to the row/column specified for the screen's resolution it will move to the desired direction by one column or row
- Left/right bindings will only change the width of a window
- Up/down bindings will only change the height of a window
- Combined left-up, left-down etc. will work on both axis sequentially

**Exceptions**:
- When changing windows between screens both x and y axis will be affected to ensure the window will fit the screen (usefull when dealing with screens using different resolutions) 
