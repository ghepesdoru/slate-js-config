
var exports = {};

var require = function (name) { return exports[name] || exports; }

var l = slate.log;
slate.log = function () {
  var all = [];

  for (var i = 0; i < arguments.length; i++) {
    all.push(JSON.stringify(arguments[i], null, 2));
  }

  l(all.join('\n'));
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function snapFactory(configuration) {
    return function snap(w, c) {
        var S = c.Slate;
        var wRect = w.rect();
        var screen = c.Screens[w.screen().id()];
        var resolution = c.Resolutions[screen.resolution];
        var localCoords = {
            x: wRect.x - screen.position.xv,
            y: wRect.y - screen.position.yv,
        };
        var corner = getCornerCoordonates(configuration.corner, screen);
        var position = {
            x: wRect.x,
            y: wRect.y,
        };
        var axis = configuration.axis;
        var direction = configuration.direction;
        var operation = configuration.operation;
        var mainDimension = axis === 'x' ? 'width' : 'height';
        var isScreenChange = false;
        var inclusiveValue = localCoords[axis] + wRect[mainDimension];
        if (configuration.corner.inclusive &&
            (inclusiveValue === corner[axis] || corner[axis] - inclusiveValue < corner[axis] / 100) ||
            localCoords[axis] === corner[axis]) {
            if (screen.neighbours[direction]) {
                screen = c.Screens[screen.neighbours[direction].ref.id()];
                resolution = c.Resolutions[screen.resolution];
                var initialPossition = getCornerCoordonates(configuration.initialPossition, screen);
                position.x = initialPossition.x;
                position.y = initialPossition.y;
                isScreenChange = true;
            }
        }
        var fitted = fitWindowToScreen(wRect, screen, resolution, axis, isScreenChange);
        var isFitOnlyCase = fitted.isFitOnlyCase;
        var height = fitted.height;
        var width = fitted.width;
        var x = position.x;
        var y = position.y;
        if (!isFitOnlyCase || isScreenChange) {
            if (axis === 'x') {
                var columnSize = screen.visibleSize.width / resolution.columns;
                var localPositionX = position.x - screen.position.x;
                x = operate(localPositionX / columnSize * columnSize, width, operation) + screen.position.x;
                x = x < screen.position.xv ?
                    screen.position.xv :
                    x + width > (screen.position.xv + screen.visibleSize.width) ?
                        (screen.position.xv + screen.visibleSize.width) - width :
                        x;
                x = Math.round(x / columnSize * columnSize);
            }
            else {
                var rowSize = screen.size.height / resolution.rows;
                y = operate(position.y / rowSize * rowSize, height, operation);
                y = y < screen.position.y ?
                    screen.position.y :
                    y + height > (screen.position.y + screen.size.height) ?
                        (screen.position.y + screen.size.height) - height :
                        y;
                y = Math.round(y / rowSize * rowSize);
            }
        }
        return S.operation("move", {
            height: height,
            screen: screen.ref,
            width: width,
            x: x,
            y: y,
        });
    };
}
exports.snapFactory = snapFactory;
function fitWindowToScreen(wRect, screen, resolution, axis, isScreenChange) {
    var columnSize = Math.round(screen.visibleSize.width / resolution.columns);
    var rowSize = Math.round(screen.visibleSize.height / resolution.rows);
    var isFitOnlyCase = false;
    var height = wRect.height;
    var width = wRect.width;
    if (axis === 'y' || isScreenChange) {
        if (wRect.height < rowSize) {
            height = rowSize;
            isFitOnlyCase = true;
        }
        else if (wRect.height > screen.visibleSize.height) {
            height = screen.visibleSize.height;
        }
        else {
            height = Math.round(wRect.height / rowSize) * rowSize;
        }
    }
    if (axis === 'x' || isScreenChange) {
        if (wRect.width < columnSize) {
            width = columnSize;
            isFitOnlyCase = true;
        }
        else if (wRect.width > screen.visibleSize.width) {
            width = screen.visibleSize.width;
        }
        else {
            width = Math.round(wRect.width / columnSize) * columnSize;
        }
    }
    return { isFitOnlyCase: isFitOnlyCase, height: height, width: width };
}
function getCornerCoordonates(corner, screen) {
    return {
        x: corner.x === 'minScreenX' ? 0 : screen.visibleSize.width,
        y: corner.y === 'minScreenY' ? 0 : screen.visibleSize.height,
    };
}
function operate(a, b, op) {
    if (op === 'add') {
        return a + b;
    }
    return a - b;
}
//# sourceMappingURL=action.factory.snap.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=action.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushLeft = function (w, c) {
    var S = c.Slate;
    var possition = w.rect();
    var screen = c.Screens[w.screen().id()];
    var resolution = c.Resolutions[screen.resolution];
    var localCoords = {
        x: possition.x - screen.position.x,
        y: possition.y - screen.position.y,
    };
    S.log(possition, localCoords, resolution);
    return S.operation("push", {
        direction: 'left',
        style: "bar-resize:screenSizeX/" + resolution.columns,
    });
};
//# sourceMappingURL=action.pushLeft.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var action_factory_snap_1 = require("./action.factory.snap");
exports.snapDown = action_factory_snap_1.snapFactory({
    axis: 'y',
    corner: {
        x: 'minScreenX',
        y: 'maxScreenY',
    },
    direction: 'bottom',
    initialPossition: {
        x: 'minScreenX',
        y: 'minScreenY',
    },
    operation: 'add',
});
//# sourceMappingURL=action.snapDown.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var action_factory_snap_1 = require("./action.factory.snap");
exports.snapLeft = action_factory_snap_1.snapFactory({
    axis: 'x',
    corner: {
        x: 'minScreenX',
        y: 'minScreenY',
    },
    direction: 'left',
    initialPossition: {
        x: 'maxScreenX',
        y: 'minScreenY',
    },
    operation: 'substract',
});
//# sourceMappingURL=action.snapLeft.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var action_factory_snap_1 = require("./action.factory.snap");
exports.snapRight = action_factory_snap_1.snapFactory({
    axis: 'x',
    corner: {
        inclusive: true,
        x: 'maxScreenX',
        y: 'minScreenY',
    },
    direction: 'right',
    initialPossition: {
        x: 'minScreenX',
        y: 'minScreenY',
    },
    operation: 'add',
});
//# sourceMappingURL=action.snapRight.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var action_factory_snap_1 = require("./action.factory.snap");
exports.snapUp = action_factory_snap_1.snapFactory({
    axis: 'y',
    corner: {
        x: 'minScreenX',
        y: 'minScreenY',
    },
    direction: 'top',
    initialPossition: {
        x: 'minScreenX',
        y: 'maxScreenY',
    },
    operation: 'substract',
});
//# sourceMappingURL=action.snapUp.js.map
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b;
var keys_1 = require("./keys");
var resolutions_1 = require("./resolutions");
var SlateConfigurator = (function () {
    function SlateConfigurator(actions, resolutions, S) {
        if (actions === void 0) { actions = keys_1.Actions; }
        if (resolutions === void 0) { resolutions = resolutions_1.Resolutions; }
        if (S === void 0) { S = slate; }
        var _this = this;
        this.screens = {};
        this.actions = actions;
        this.resolutions = resolutions;
        this.S = S;
        this.S.on("screenConfigurationChanged", function () {
            _this.getScreensReferences();
        });
        this.getScreensReferences();
        this.bindActions();
        this.filler();
    }
    Object.defineProperty(SlateConfigurator.prototype, "Slate", {
        get: function () {
            return this.S;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlateConfigurator.prototype, "Resolutions", {
        get: function () {
            return this.resolutions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlateConfigurator.prototype, "Screens", {
        get: function () {
            return this.screens;
        },
        enumerable: true,
        configurable: true
    });
    SlateConfigurator.prototype.getScreensReferences = function () {
        var _this = this;
        this.screens = {};
        var screens = [];
        var main;
        this.S.eachScreen(function (s) {
            var rect = s.rect();
            var vrect = s.visibleRect();
            var screenInfo = {
                main: s.isMain(),
                neighbours: {
                    bottom: null, bottomLeft: null, bottomRight: null,
                    left: null,
                    right: null,
                    top: null, topLeft: null, topRight: null,
                },
                position: {
                    x: rect.x,
                    xv: vrect.x,
                    y: rect.y,
                    yv: vrect.y,
                },
                ref: s,
                resolution: _this.determineResolutionType(rect),
                size: { width: rect.width, height: rect.height },
                visibleSize: { width: vrect.width, height: vrect.height },
            };
            if (screenInfo.main) {
                main = screenInfo;
            }
            else {
                screens.push(screenInfo);
            }
        });
        this.screens[main.ref.id()] = main;
        screens.sort(this.sortScreens).forEach(function (s) {
            var comp = _this.screenComparison(s, main);
            _this.assignNeighbours(comp, main, s);
            _this.screens[s.ref.id()] = s;
        });
    };
    SlateConfigurator.prototype.assignNeighbours = function (relation, of, to) {
        var neighbourRef = ScreenPositionsToNeighbours[relation];
        var invertedRef = ScreenPositionsToNeighboursInversion[relation];
        if (!of.neighbours[neighbourRef]) {
            of.neighbours[neighbourRef] = to;
        }
        else {
            var relation2 = this.screenComparison(of.neighbours[neighbourRef], to);
            this.swapNeighbours(of, to, relation2, relation);
        }
        if (!to.neighbours[invertedRef]) {
            to.neighbours[invertedRef] = of;
        }
    };
    SlateConfigurator.prototype.swapNeighbours = function (of, to, relation, originalRelation) {
        to.neighbours[ScreenPositionsToNeighbours[relation]] = of.neighbours[ScreenPositionsToNeighbours[originalRelation]];
        to.neighbours[ScreenPositionsToNeighbours[relation]].neighbour[ScreenPositionsToNeighboursInversion[relation]] = to;
        of.neighbours[ScreenPositionsToNeighbours[originalRelation]] = to;
    };
    SlateConfigurator.prototype.sortScreens = function (a, b) {
        var x = a.position.x - b.position.x;
        return x === 0 ? a.position.y - b.position.y : x;
    };
    SlateConfigurator.prototype.screenComparison = function (a, b) {
        if (a.position.y < b.position.y) {
            if (a.position.y + a.size.height === b.position.y) {
                if (a.position.x + a.size.width === b.position.x) {
                    return "top-left";
                }
                else if (a.position.x === b.position.x + b.size.width) {
                    return "top-right";
                }
                return "top";
            }
            else {
            }
        }
        else if (a.position.y > b.position.y) {
            if (a.position.y === b.position.y + b.size.height) {
                if (a.position.x + a.size.width === b.position.x) {
                    return "bottom-left";
                }
                else if (a.position.x === b.position.x + b.size.width) {
                    return "bottom-right";
                }
                return "bottom";
            }
            else {
            }
        }
        if (a.position.x > b.position.x) {
            return "right";
        }
        else if (a.position.x < b.position.x) {
            return "left";
        }
        return null;
    };
    SlateConfigurator.prototype.filler = function () {
        var _this = this;
        var screens = {};
        Object.keys(this.screens).forEach(function (id) {
            var s = _this.screens[id];
            screens[id] = __assign({}, s, { neighbours: {} });
            Object.keys(s.neighbours).forEach(function (d) {
                var ss = s.neighbours[d];
                if (ss) {
                    screens[id].neighbours[d] = ss.ref.id();
                }
                else {
                    screens[id].neighbours[d] = null;
                }
            });
        });
        slate.log({
            actions: this.actions,
            resolutions: this.resolutions,
            screens: screens,
        });
    };
    SlateConfigurator.prototype.bindActions = function () {
        var _this = this;
        this.actions.forEach(function (action) {
            _this.S.bind(action.keybinding, function (win) {
                var operation = action.action(win, _this);
                win.doOperation(operation);
            });
        });
    };
    SlateConfigurator.prototype.determineResolutionType = function (rect) {
        var _this = this;
        var rests = Object.keys(this.Resolutions).map(function (rType) {
            var resolution = _this.resolutions[rType];
            var dH = rect.height - resolution.size.h;
            var dW = rect.width - resolution.size.w;
            return {
                h: dH,
                type: rType,
                w: dW,
            };
        }).sort(function (a, b) {
            var w = a.w - b.w;
            return w === 0 ? a.h - b.h : w;
        });
        this.S.log(rests);
        for (var _i = 0, rests_1 = rests; _i < rests_1.length; _i++) {
            var a = rests_1[_i];
            if (a.w === 0 && a.h === 0) {
                return a.type;
            }
        }
        return resolutions_1.ResolutionType.HD;
    };
    return SlateConfigurator;
}());
exports.SlateConfigurator = SlateConfigurator;
var ScreenPositions;
(function (ScreenPositions) {
    ScreenPositions["top"] = "top";
    ScreenPositions["top-left"] = "top-left";
    ScreenPositions["top-right"] = "top-right";
    ScreenPositions["bottom"] = "bottom";
    ScreenPositions["bottom-left"] = "bottom-left";
    ScreenPositions["bottom-right"] = "bottom-right";
    ScreenPositions["right"] = "right";
    ScreenPositions["left"] = "left";
})(ScreenPositions || (ScreenPositions = {}));
var ScreenPositionsToNeighbours = (_a = {},
    _a["bottom"] = 'bottom',
    _a["bottom-left"] = 'bottomLeft',
    _a["bottom-right"] = 'bottom-right',
    _a["left"] = 'left',
    _a["right"] = 'right',
    _a["top"] = 'top',
    _a["top-left"] = 'topLeft',
    _a["top-right"] = 'topRight',
    _a);
var ScreenPositionsToNeighboursInversion = (_b = {},
    _b["bottom"] = ScreenPositionsToNeighbours["top"],
    _b["bottom-left"] = ScreenPositionsToNeighbours["top-right"],
    _b["bottom-right"] = ScreenPositionsToNeighbours["top-left"],
    _b["left"] = ScreenPositionsToNeighbours["right"],
    _b["right"] = ScreenPositionsToNeighbours["left"],
    _b["top"] = ScreenPositionsToNeighbours["bottom"],
    _b["top-left"] = ScreenPositionsToNeighbours["bottom-right"],
    _b["top-right"] = ScreenPositionsToNeighbours["bottom-left"],
    _b);
//# sourceMappingURL=configurator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var action_snapDown_1 = require("./action.snapDown");
var action_snapLeft_1 = require("./action.snapLeft");
var action_snapRight_1 = require("./action.snapRight");
var action_snapUp_1 = require("./action.snapUp");
exports.Actions = [
    {
        action: action_snapLeft_1.snapLeft,
        keybinding: 'left:ctrl,cmd',
    },
    {
        action: action_snapRight_1.snapRight,
        keybinding: 'right:ctrl,cmd',
    },
    {
        action: action_snapUp_1.snapUp,
        keybinding: 'up:ctrl,cmd',
    },
    {
        action: action_snapDown_1.snapDown,
        keybinding: 'down:ctrl,cmd',
    },
];
//# sourceMappingURL=keys.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushLeft = function (_, c) {
    return c.slate.operation("push", {
        direction: 'left',
        style: 'bar-resize:screenSizeX/2',
    });
};
//# sourceMappingURL=pushLeft.action.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResolutionType;
(function (ResolutionType) {
    ResolutionType["SVGA"] = "SVGA";
    ResolutionType["WSVGA"] = "WSVGA";
    ResolutionType["XGA"] = "XGA";
    ResolutionType["XGA+"] = "XGA+";
    ResolutionType["WXGA"] = "WXGA";
    ResolutionType["SXGA"] = "SXGA";
    ResolutionType["HD"] = "HD";
    ResolutionType["WXGA+"] = "WXGA+";
    ResolutionType["HD+"] = "HD+";
    ResolutionType["WSXGA+"] = "WSXGA+";
    ResolutionType["FHD"] = "FHD";
    ResolutionType["WUXGA"] = "WUXGA";
    ResolutionType["QHD"] = "QHD";
    ResolutionType["UWQHD"] = "UWQHD";
    ResolutionType["4K UHD"] = "4K UHD";
})(ResolutionType = exports.ResolutionType || (exports.ResolutionType = {}));
exports.Resolutions = {
    'SVGA': { columns: 2, rows: 1, size: { h: 600, w: 800 }, type: ResolutionType.SVGA },
    'WSVGA': { columns: 2, rows: 1, size: { h: 600, w: 1024 }, type: ResolutionType.WSVGA },
    'XGA': { columns: 2, rows: 1, size: { h: 768, w: 1024 }, type: ResolutionType.XGA },
    'XGA+': { columns: 2, rows: 1, size: { h: 864, w: 1152 }, type: ResolutionType['XGA+'] },
    'WXGA': { columns: 2, rows: 1, size: { h: 800, w: 1280 }, type: ResolutionType.WXGA },
    'SXGA': { columns: 2, rows: 1, size: { h: 1024, w: 1280 }, type: ResolutionType.SXGA },
    'HD': { columns: 2, rows: 1, size: { h: 768, w: 1366 }, type: ResolutionType.HD },
    'WXGA+': { columns: 2, rows: 1, size: { h: 900, w: 1440 }, type: ResolutionType['WXGA+'] },
    'HD+': { columns: 2, rows: 1, size: { h: 900, w: 1600 }, type: ResolutionType['HD+'] },
    'WSXGA+': { columns: 2, rows: 1, size: { h: 1050, w: 1680 }, type: ResolutionType['WSXGA+'] },
    'FHD': { columns: 2, rows: 1, size: { h: 1080, w: 1920 }, type: ResolutionType.FHD },
    'WUXGA': { columns: 2, rows: 1, size: { h: 1200, w: 1920 }, type: ResolutionType.WUXGA },
    'QHD': { columns: 2, rows: 1, size: { h: 1440, w: 2560 }, type: ResolutionType.QHD },
    'UWQHD': { columns: 3, rows: 2, size: { h: 1440, w: 3440 }, type: ResolutionType.UWQHD },
    '4K UHD': { columns: 3, rows: 1, size: { h: 2160, w: 3840 }, type: ResolutionType['4K UHD'] },
};
//# sourceMappingURL=resolutions.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configurator_1 = require("./configurator");
var a = new configurator_1.SlateConfigurator();
console.info(a);
//# sourceMappingURL=slate.js.map
require('slate');