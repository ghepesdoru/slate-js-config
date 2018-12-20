import * as Slate from 'slate-definition';

import { Actions, IAction } from './keys';
import { Resolutions, ResolutionsMap, ResolutionType } from './resolutions';

export class SlateConfigurator {
  /**
   * All supported actions
   */
  private actions: IAction[];

  /**
   * All supported resolutions
   */
  private resolutions: ResolutionsMap;

  /**
   * Available screens with precomputed details
   */
  private screens: { [id: string]: IScreenDetails } = {};

  /**
   * Reference to the current instance of Slate
   */
  private S: Slate.Slate;

  /**
   * Slate generates a slate configuration object
   * @param actions All supported actions with keyboard bindings
   * @param resolutions All supported resolutions with rows and columns configuration
   */
  public constructor(actions: IAction[] = Actions, resolutions: ResolutionsMap = Resolutions, S: Slate.Slate = slate) {
    this.actions = actions;
    this.resolutions = resolutions;
    this.S = S;

    // Set a listener for screen changes
    this.S.on(Slate.SlateScreenEvent.screenConfigurationChanged, () => {
      // Refresh the screens configuration
      this.getScreensReferences();
    });

    // Grab the current screens configuration
    this.getScreensReferences();

    // Bind all actions
    this.bindActions();

    this.filler();
  }

  /**
   * Slate instance getter
   */
  public get Slate() {
    return this.S;
  }

  public get Resolutions() {
    return this.resolutions;
  }

  public get Screens() {
    return this.screens;
  }

  /**
   * Caches the current list of screens
   * This method can be called multiple time based on enviroment changes
   */
  private getScreensReferences() {
    this.screens = {}; // Clean state
    const screens: IScreenDetails[] = [];
    let main: IScreenDetails;

    this.S.eachScreen((s) => {
      const rect = s.rect();
      const vrect = s.visibleRect();
      const screenInfo: IScreenDetails = {
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
        resolution: this.determineResolutionType(rect),
        size: { width: rect.width, height: rect.height },
        visibleSize: { width: vrect.width, height: vrect.height },
      };

      if (screenInfo.main) {
        main = screenInfo;
      } else {
        screens.push(screenInfo);
      }
    });

    this.screens[main.ref.id()] = main;

    // Order the screens horizontally first and vertical after
    screens.sort(this.sortScreens).forEach((s) => {
      const comp = this.screenComparison(s, main);

      this.assignNeighbours(comp, main, s);
      this.screens[s.ref.id()] = s;
    });
  }

  /**
   * Assigns relationships to screens based on determined relationship
   */
  private assignNeighbours(relation: ScreenPositions, of: IScreenDetails, to: IScreenDetails) {
    const neighbourRef = ScreenPositionsToNeighbours[relation];
    const invertedRef = ScreenPositionsToNeighboursInversion[relation];

    if (!of.neighbours[neighbourRef]) {
      of.neighbours[neighbourRef] = to;
    } else {
      // Check whate is the relationshiop of to to the current relation of "of"
      const relation2 = this.screenComparison(of.neighbours[neighbourRef], to);

      this.swapNeighbours(of, to, relation2, relation);
    }

    if (!to.neighbours[invertedRef]) {
      to.neighbours[invertedRef] = of;
    }
  }

  private swapNeighbours(
    of: IScreenDetails, to: IScreenDetails, relation: ScreenPositions, originalRelation: ScreenPositions) {
    to.neighbours[ScreenPositionsToNeighbours[relation]] = of.neighbours[ScreenPositionsToNeighbours[originalRelation]];
    to.neighbours[ScreenPositionsToNeighbours[relation]].neighbour[ScreenPositionsToNeighboursInversion[relation]] = to;

    of.neighbours[ScreenPositionsToNeighbours[originalRelation]] = to;
  }

  /**
   * Sort screens on by X axis position and differentiate by Y axis possition
   */
  private sortScreens(a: IScreenDetails, b: IScreenDetails) {
    const x = a.position.x - b.position.x;
    return x === 0 ? a.position.y - b.position.y : x;
  }

  /**
   * Compares screen a to b, and determine the relative position of a to b
   */
  private screenComparison(a: IScreenDetails, b: IScreenDetails): ScreenPositions {
    if (a.position.y < b.position.y) {
      // A is above screen b
      if (a.position.y + a.size.height === b.position.y) {
        // A is entirely above
        if (a.position.x + a.size.width === b.position.x) {
          // A is in the left top corner
          return ScreenPositions['top-left'];
        } else if (a.position.x === b.position.x + b.size.width) {
          // A is in the right top corner
          return ScreenPositions['top-right'];
        }

        // A is above
        return ScreenPositions.top;
      } else {
        // Non entirely above screens fall in the generic category bellow
      }
    } else if (a.position.y > b.position.y) {
      // A is bellow screen b
      if (a.position.y === b.position.y + b.size.height) {
        // A is entirely bellow
        if (a.position.x + a.size.width === b.position.x) {
          // A is in the left bottom corner
          return ScreenPositions['bottom-left'];
        } else if (a.position.x === b.position.x + b.size.width) {
          // A is in the left bottom corner
          return ScreenPositions['bottom-right'];
        }

        // A is bellow
        return ScreenPositions.bottom;
      } else {
        // Non entirely bellow screens fall in the generic category bellow
      }
    }

    // A is aside of b
    if (a.position.x > b.position.x) {
      // Right sided
      return ScreenPositions.right;
    } else if (a.position.x < b.position.x) {
      // Left sided
      return ScreenPositions.left;
    }

    return null;
  }

  private filler() {
    const screens = {};

    Object.keys(this.screens).forEach((id) => {
      const s = this.screens[id];

      screens[id] = {
        ...s,
        neighbours: {},
      };

      Object.keys(s.neighbours).forEach((d) => {
        const ss = s.neighbours[d];

        if (ss) {
          screens[id].neighbours[d] = ss.ref.id();
        } else {
          screens[id].neighbours[d] = null;
        }
      });
    });

    slate.log({
      actions: this.actions,
      resolutions: this.resolutions,
      screens,
    });
  }

  private bindActions() {
    this.actions.forEach((action) => {
      this.S.bind(action.keybinding, (win: Slate.Window) => {
        const operation = action.action(win, this);

        win.doOperation(operation);
      });
    });
  }

  /**
   * Given the rect size of a screen deatermines it's resolution type (category) or the closest existing type
   * In cases where a direct screen size cannot be determined for a specific screen,
   * the smaller (rather then bigger) closest resolution will be selected.
   *
   * TODO: Refine the selection to allow for non matching screen sizes.
   */
  private determineResolutionType(rect: Slate.RectArea): ResolutionType {
    const rests: Array<{ w: number; h: number; type: ResolutionType }> =
      Object.keys(this.Resolutions).map((rType: ResolutionType) => {
        const resolution = this.resolutions[rType];
        const dH = rect.height - resolution.size.h;
        const dW = rect.width - resolution.size.w;

        return {
          h: dH,
          type: rType,
          w: dW,
        };
      }).sort((a, b) => {
        const w = a.w - b.w;
        return w === 0 ? a.h - b.h : w;
      });

    this.S.log(rests);

    for (const a of rests) {
      // Perfect match
      if (a.w === 0 && a.h === 0) {
        return a.type;
      }
    }

    return ResolutionType.HD;
  }
}

/**
 * Screen details
 */
export interface IScreenDetails {
  /**
   * Remember the absolute possition of the screene
   */
  position: { x: number; y: number; xv: number, yv: number; };

  /**
   * Size of the screen
   */
  size: { width: number; height: number; };

  /**
   * Visible size of the screen
   */
  visibleSize: { width: number; height: number; };

  /**
   * Left, right, down and up displays from the current one
   */
  neighbours: {
    left: IScreenDetails;
    topLeft: IScreenDetails;
    bottomLeft: IScreenDetails;
    right: IScreenDetails;
    topRight: IScreenDetails;
    bottomRight: IScreenDetails;
    top: IScreenDetails;
    bottom: IScreenDetails;
  };

  /**
   * Tracks if the current display is the main one or not
   */
  main: boolean;

  /**
   * Reference to the original Screen object
   */
  ref: Slate.Screen;

  resolution: ResolutionType;
}

const enum ScreenPositions {
  'top' = 'top',
  'top-left' = 'top-left',
  'top-right' = 'top-right',
  'bottom' = 'bottom',
  'bottom-left' = 'bottom-left',
  'bottom-right' = 'bottom-right',
  'right' = 'right',
  'left' = 'left',
}

/**
 * Screen positions to neighbour alias
 */
const ScreenPositionsToNeighbours = {
  [ScreenPositions.bottom]: 'bottom',
  [ScreenPositions['bottom-left']]: 'bottomLeft',
  [ScreenPositions['bottom-right']]: 'bottom-right',
  [ScreenPositions.left]: 'left',
  [ScreenPositions.right]: 'right',
  [ScreenPositions.top]: 'top',
  [ScreenPositions['top-left']]: 'topLeft',
  [ScreenPositions['top-right']]: 'topRight',
};

/**
 * Screen positions to neighbour's inverted alias
 */
const ScreenPositionsToNeighboursInversion = {
  [ScreenPositions.bottom]: ScreenPositionsToNeighbours[ScreenPositions.top],
  [ScreenPositions['bottom-left']]: ScreenPositionsToNeighbours[ScreenPositions['top-right']],
  [ScreenPositions['bottom-right']]: ScreenPositionsToNeighbours[ScreenPositions['top-left']],
  [ScreenPositions.left]: ScreenPositionsToNeighbours[ScreenPositions.right],
  [ScreenPositions.right]: ScreenPositionsToNeighbours[ScreenPositions.left],
  [ScreenPositions.top]: ScreenPositionsToNeighbours[ScreenPositions.bottom],
  [ScreenPositions['top-left']]: ScreenPositionsToNeighbours[ScreenPositions['bottom-right']],
  [ScreenPositions['top-right']]: ScreenPositionsToNeighbours[ScreenPositions['bottom-left']],
};
