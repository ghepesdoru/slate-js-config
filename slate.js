/* Constants */
var Constants = {
        Quadrant_1: 0,
        Quadrant_2: 1,
        Quadrant_3: 2,
        Quadrant_4: 3,
        Quadrant_Unknown: -1,
        MoveModifier: 0.05
    },
    Screens = (function (){
        var screens = {},
            windows = {},
            parsedScreenData = {};
        
        S.eachScreen(function(s) {
            /* Grab data for each screen */
            screens[s.id()] = s;
        });
        
        S.eachApp(function(app) {
            /* Loop throw applications, look over windows, and remember a window for each screen (if exists) */
            app.eachWindow(function (w) {
                windows[w.screen().id()] = w;
            });
        });
        
        Object.keys(screens).forEach(function(i) {
            parsedScreenData[i] = getScreenData(screens[i], windows[i]);
        });

        return parsedScreenData;
    }()),
    DirectionQuadrantIncrese = {
        "up": false,
        "down": true,
        "right": true,
        "left": false
    },
    KeyBindings = {
        MoveAndResizeDown:  "down:ctrl,cmd",
        MoveAndResizeUp:    "up:ctrl,cmd",
        MoveAndResizeLeft:  "left:ctrl,cmd",
        MoveAndResizeRight: "right:ctrl,cmd",
        ShrinkHeigh:        "down:ctrl,alt",
        ExtendHeight:       "up:ctrl,alt",
        ShrinkWidth:        "left:ctrl,alt",
        ExtendWidth:        "right:ctrl,alt",
        MoveDown:           "down:ctrl,cmd,alt",
        MoveUp:             "up:ctrl,cmd,alt",
        MoveLeft:           "left:ctrl,cmd,alt",
        MoveRight:          "right:ctrl,cmd,alt"
    };

/* General purpose functions */
function getScreenData(s, w) {
    var s = s || S.screen(),
        tmp,
        rect,
        visibleRect,
        screenData;
    
    if (s && Screens && (tmp = Screens[s.id()]) && tmp !== undefined && tmp.quadrant !== null) {
        return tmp;
    } else {
        /* No data collected for the current screen up to this point */
        visibleRect = s.visibleRect();
        rect = s.rect();
        screenData = {
            topX: visibleRect.x,
            topY: visibleRect.y,
            height: visibleRect.height,
            width: visibleRect.width,
            midY: null,
            midX: null,
            id: s.id(),
            quadrant: null
        }
    }
    
    /* Collect quadrant informations from the specified contained window */
    if (w !== undefined) {
        if (w.screen().id() === screenData.id) {
            /* Only take relevant windows into account */
            screenData.quadrant = detectQuadrant(visibleRect, w.rect());
        }
    }
    
    /* Determine the mead screen points */
    if (screenData.quadrant !== null) {
        screenData.midX = surfaceMean(screenData.topX, screenData.width);
        screenData.midY = surfaceMean(screenData.topY, screenData.height);
    }
    
    /* Add the new screen definition to the screens object. */
    if (Screens) {
        Screens[screenData.id] = screenData;
    }
    
    return screenData;
}

/* Calculates the mean between specified values, in specified quadrant */
function surfaceMean(min, max, quadrant) {
    if (quadrant == Constants.Quadrant_1 || quadrant == Constants.Quadrant_2) {
        /* Quadrant 1, 2 - origin 0,0 -> infinity,(+, -)infinity */
        return (max - min) / 2;
    } else {
        /* Quadrant 3, 4 - origin 0,0 -> -infinity,(+, -)infinity */
        return min + (max / 2);
    }
}

/* Grabs window related data */
function getWindowData(w) {
    var rect = w.rect(),
        sD = getScreenData(w.screen()),
        wD;
    
    wD = {
        topX: rect.x,
        topY: rect.y,
        height: rect.height,
        width: rect.width,
        midY: surfaceMean(rect.y, rect.height, sD.quadrant),
        midX: surfaceMean(rect.x, rect.width, sD.quadrant),
        distTop: rect.y - sD.topY,
        distLeft: rect.x - sD.topX,
        distRight: null,
        distBottom: null,
        pid: w.pid(),
        name: w.app().name()
    };
    
    wD.distRight = sD.width - wD.distLeft - wD.width;
    wD.distBottom = sD.height - wD.distTop - wD.height;
    
    return wD;
}

/* Given a screen rect data object and a window rect data object, detects the orientation of the screen content */
function detectQuadrant(sR, wR) {
    if (sR && wR && sR.x !== undefined && sR.y !== undefined && wR.y !== undefined) {
        if (sR.x >= 0 && sR.y >= 0) {
            /* Quadrant I and II */
            if (wR.y > 0) {
                return Constants.Quadrant_1;
            } else {
                return Constants.Quadrant_2;
            }
        } else {
            /* Quadrant III and IV */
            if (wR.y < 0) {
                return Constants.Quadrant_3;
            } else {
                return Constants.Quadrant_4;
            }
        }
    }
    
    return Quadrant_Unknown;
}

/* Make the current window fill the entire height of it's screen */
slate.bind(KeyBindings.MoveAndResizeUp, function (win) {
    var w = getWindowData(win),
        s = getScreenData(win.screen()),
        halfScreen = s.height / 2,
        move = {
           x: w.topX,
           y: w.topY,
           width: w.width,
           height: w.height,
           screen: s.id
        };

    /* Reposition windows smaller then half a screen to the top/mid, and resize */
    if (s.height / 2 > w.height) {
        if (w.distTop < w.distBottom) {
           if (w.topY != s.topY) {
                /* Arange the window with the top of the screen */
                move.y = s.topY;
           } else {
                /* Window at top of the screen, enlarge it to fill half screen */
                move.height = halfScreen;
           }
        } else {
           if (w.topY != s.midY) {
                /* Arange the window with the screen middle */
                move.y = s.midY;
           } else {
                /* Window at mid screen, enlarge it to fill half screen */
                move.y = s.midY;
                move.height = halfScreen;
           }
        }
    } else if (halfScreen == w.height) {
        if (w.distTop == 0) {
           /* Enlarge the window to fullscreen */
           move.height = s.height;
        } else {
           /* Move the widow to the top of the screen on half screen windows */
           move.y = s.topY;
        }
    } else if (s.height == w.height) {
        /* Minimize full screen height windows to half of screen and position at top */
        move.y = s.topY;
        move.height = halfScreen;
    } else if (w.distTop > 0) {
        /* Enlarge the window from it's current position to the top of the screen */
        move.y = s.topY;
        move.height = s.height - w.distBottom;
    } else {
        /* Resize the window to half screen and move it top */
        move.height = halfScreen;
        move.y = s.topY;
    }
           
    win.doOperation(slate.operation("move", {
                                    "x": move.x,
                                    "y": move.y,
                                    "width": move.width,
                                    "height": move.height,
                                    "screen": move.screen
    }));
});

/* Make the current window fill half the height of it's screen */
slate.bind(KeyBindings.MoveAndResizeDown, function (win) {
    var w = getWindowData(win),
        s = getScreenData(win.screen()),
        halfScreen = s.height / 2,
        move = {
           x: w.topX,
           y: w.topY,
           width: w.width,
           height: w.height,
           screen: s.id
        };
           
    /* Reposition windows smaller then half a screen to the bottom (at mid screen and bottom) */
    if (s.height / 2 > w.height) {
        if (w.distTop < w.distBottom) {
           if ((w.topY + w.height) != s.midY) {
                /* Arange the window with the middle of the screen */
                move.y = s.midY - w.height;
           } else {
                /* Window at middle of the screen, enlarge it to fill half screen */
                move.height = halfScreen;
                move.y = s.midY - move.height;
           }
        } else {
           if (w.distBottom > 0) {
                /* Arange the window with the screen bottom */
                move.y = s.topY + s.height - w.height;
           } else {
                /* Window at screen bottom, enlarge it to fill half screen */
                move.y = s.midY;
                move.height = halfScreen;
           }
        }
    } else if (halfScreen == w.height) {
        if (w.distBottom == 0) {
           /* Halfen then window height */
           move.y = s.midY + halfScreen / 2;
           move.height = halfScreen / 2;
        } else {
           /* Move the widow to the bottom of the screen on half screen windows */
           move.y = s.midY;
        }
    } else if (s.height == w.height) {
        /* Minimize full screen height windows to half of screen and position at bottom */
        move.y = s.midY;
        move.height = halfScreen;
    } else if (w.distBottom > 0) {
        /* Enlarge the window from it's current position to the bottom of the screen */
        move.height = s.height - w.distTop;
    } else {
        /* Resize the window to half screen and move it bottom */
        move.height = halfScreen;
        move.y = s.midY;
    }
           
    win.doOperation(slate.operation("move", {
                                    "x": move.x,
                                    "y": move.y,
                                    "width": move.width,
                                    "height": move.height,
                                    "screen": move.screen
    }));
});

/* Make the current window fill half the width of the screen */
slate.bind(KeyBindings.MoveAndResizeLeft, function (win) {
    var w = getWindowData(win),
        s = getScreenData(win.screen()),
        halfScreen = s.width / 2,
        move = {
           x: w.topX,
           y: w.topY,
           width: w.width,
           height: w.height,
           screen: s.id
        };
        
    /* Reposition windows smaller then half a screen to the left or mid screen */
    if (s.width / 2 > w.width) {
        if (w.distLeft < w.distRight) {
           if (w.topX != s.topX) {
                /* Arange the window with the left of the screen */
                move.x = s.topX;
           } else {
                /* Window at left of the screen, enlarge it to fill half screen */
                move.width = halfScreen;
                move.x = s.topX;
           }
        } else {
           if (w.distLeft > halfScreen) {
                /* Arange the window with the screen middle */
                move.x = s.midX;
           } else {
                /* Window at screen right, enlarge it to fill half screen */
                move.width = halfScreen;
                move.x = s.midX;
           }
        }
    } else if (halfScreen == w.width) {
           if (w.distLeft == 0) {
                /* Halfen then window width */
                move.x = s.topX;
                move.width = halfScreen / 2;
           } else {
                /* Move the widow to the left of the screen on half screen windows */
                move.x = s.topX;
           }
    } else if (s.width == w.width) {
        /* Minimize full screen width windows to half of screen and position at left */
        move.width = halfScreen;
    } else if (w.distLeft > 0) {
        /* Enlarge the window from it's current position to the left of the screen */
        move.width = s.width - w.distRight;
        move.x = s.topX;
    } else {
        /* Resize the window to half screen and move it left */
        move.width = halfScreen;
        move.x = s.topX;
    }
           
    win.doOperation(slate.operation("move", {
                                    "x": move.x,
                                    "y": move.y,
                                    "width": move.width,
                                    "height": move.height,
                                    "screen": move.screen
    }));
});

/* Make the current window fill the width of the screen */
slate.bind(KeyBindings.MoveAndResizeRight, function (win) {
    var w = getWindowData(win),
        s = getScreenData(win.screen()),
        halfScreen = s.width / 2,
        move = {
           x: w.topX,
           y: w.topY,
           width: w.width,
           height: w.height,
           screen: s.id
        };
           
    /* Reposition windows smaller then half a screen to the left or mid screen */
    if (s.width / 2 > w.width) {
        if (w.distLeft < w.distRight) {
           if ((w.topX + w.width) != s.midX) {
                /* Arange the window with the middle of the screen */
                move.x = s.midX - w.width;
           } else {
                /* Window at middle of the screen, enlarge it to fill half screen */
                move.width = halfScreen;
                move.x = s.topX;
           }
        } else {
           if (w.distRight > 0) {
                /* Arange the window with the right of the screen */
                move.x = s.topX + s.width - w.width;
           } else {
                /* Window at screen right, enlarge it to fill half screen */
                move.width = halfScreen;
                move.x = s.midX;
           }
        }
    } else if (halfScreen == w.width) {
        if (w.topX == s.midX) {
           /* Extend the window to the full screen width */
           move.width = s.width;
           move.x = s.topX;
        } else {
           /* Move the widow to the right of the screen on half screen windows */
           move.x = s.midX;
        }
    } else if (s.width == w.width) {
        /* Minimize full screen width windows to half of screen and position at left */
        move.width = halfScreen;
        move.x = s.midX;
    } else if (w.distLeft > 0) {
        /* Enlarge the window from it's current position to the right of the screen */
        move.width = s.width - w.distLeft;
    } else {
        /* Resize the window to half screen and move it right */
        move.width = halfScreen;
        move.x = s.midX;
    }
           
    win.doOperation(slate.operation("move", {
                                    "x": move.x,
                                    "y": move.y,
                                    "width": move.width,
                                    "height": move.height,
                                    "screen": move.screen
    }));
});

/* Make the current window extend down */
slate.bind(KeyBindings.ShrinkHeigh, function (win) {
    win.doOperation(slate.operation("resize", {
                                    "width": "+0",
                                    "height": "+5%"
    }));
}, true)

/* Lower the current window's hight */
slate.bind(KeyBindings.ExtendHeight, function (win) {
    win.doOperation(slate.operation("resize", {
                                    "width": "+0",
                                    "height": "-5%"
    }));
}, true);

/* Extend the current window to the left */
slate.bind(KeyBindings.ShrinkWidth, function (win) {
    win.doOperation(slate.operation("resize", {
                                    "width": "-5%",
                                    "height": "+0%",
                                    "anchor": "top-left"
    }));
}, true);

/* Extend the current window to the left */
slate.bind(KeyBindings.ExtendWidth, function (win) {
    win.doOperation(slate.operation("resize", {
                                    "width": "+5%",
                                    "height": "+0%",
                                    "anchor": "top-left"
    }));
}, true);

/* Generates a move configuration object for any of the MoveDirection actions */
function generateMoveConfig(win, direction) {
    var w = getWindowData(win),
        s = getScreenData(win.screen()),
        diff,
        map = {
            "down": {
                coord: "y",
                distance: "distBottom"
            },
            "up":   {
                coord: "y",
                distance: "distTop"
            },
            "left": {
                coord: "x",
                distance: "distLeft"
            },
            "right": {
                coord: "x",
                distance: "distRight"
            }
        },
        screenDiffs = {
            "y": s.height * Constants.MoveModifier,
            "x": s.width * Constants.MoveModifier
        },
        move = {
            x: w.topX,
            y: w.topY,
            width: w.width,
            height: w.height,
            screen: s.id
        };
    
    /* Generate the difference, and protect against overflows */
    diff = screenDiffs[map[direction].coord] > w[map[direction].distance] ? w[map[direction].distance] : screenDiffs[map[direction].coord];
    
    /* Take Quadrant into account, taking DirectionQuadrantIncrese map as guideline */
    move[map[direction].coord] = DirectionQuadrantIncrese[direction] ? move[map[direction].coord] + diff : move[map[direction].coord] - diff;

    return move;
}

/* Move the current window down */
slate.bind(KeyBindings.MoveDown, function (win) {
    win.doOperation(slate.operation("move", generateMoveConfig(win, "down")));
}, true);

/* Move the current window up */
slate.bind(KeyBindings.MoveUp, function (win) {
    win.doOperation(slate.operation("move", generateMoveConfig(win, "up")));
}, true);

/* Move the current window left */
slate.bind(KeyBindings.MoveLeft, function (win) {
    win.doOperation(slate.operation("move", generateMoveConfig(win, "left")));
}, true);

/* Move the current window down */
slate.bind(KeyBindings.MoveRight, function (win) {
    win.doOperation(slate.operation("move", generateMoveConfig(win, "right")));
}, true);


