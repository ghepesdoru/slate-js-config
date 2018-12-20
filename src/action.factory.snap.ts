import * as Slate from 'slate-definition';

import { Action } from './action';
import { IScreenDetails } from './configurator';
import { IResolutin } from './resolutions';

/**
 * Snap Factory
 * Generates snap actions based on provided configuration
 * Can be used to generate: left, right, up, down, top-left, bottom-left, top-right, bottom-right actions.
 */
export function snapFactory(configuration: ISnapConfiguration): Action {
  return function snap(w, c) {
    const S = c.Slate;

    const wRect = w.rect(); // Get the window rect
    let screen = c.Screens[w.screen().id()]; // Get the screen reference
    let resolution = c.Resolutions[screen.resolution]; // Get the screen's resolution configuration
    const localCoords = {
      // Determine the window's screen local coordinates
      x: wRect.x - screen.position.xv,
      y: wRect.y - screen.position.yv,
    };

    // Deteremine the corner values
    const corner = getCornerCoordonates(configuration.corner, screen);

    // Determine the current values
    const position = {
      x: wRect.x,
      y: wRect.y,
    };

    // Get configuration values
    const axis = configuration.axis;
    const direction = configuration.direction;
    const operation = configuration.operation;
    const mainDimension = axis === 'x' ? 'width' : 'height';
    let isScreenChange = false;

    // S.log('Window location and necesity to change screen',
    //   wRect,
    //   {
    //     cornerOnAxis: corner[axis],
    //     inclusive: configuration.corner.inclusive,
    //     inclusiveValue: localCoords[axis] + wRect[mainDimension],
    //   });

    // Test if a screen change is required
    const inclusiveValue = localCoords[axis] + wRect[mainDimension];
    if (
      configuration.corner.inclusive &&
        (inclusiveValue === corner[axis] || corner[axis] - inclusiveValue < corner[axis] / 100 ) ||
      localCoords[axis] === corner[axis]
    ) {
      // S.log('Should change screen',
      //   {
      //     corner: corner[axis],
      //     inclusive: !!configuration.corner.inclusive,
      //     inclusiveVal: localCoords[axis] + wRect[mainDimension],
      //     local: localCoords[axis],
      //   });
      // The window is already at the limit of the screen, check if there is a neighbour screen on desired direction
      if (screen.neighbours[direction]) {
        // S.log(`Will change screen from ${screen.ref.id()} to ${screen.neighbours[direction].ref.id()}`,
        //   `Are references equal?! ${screen.ref === screen.neighbours[direction].ref}`);
        // A screen change can be done, change the screen and resolution
        screen = c.Screens[screen.neighbours[direction].ref.id()];
        resolution = c.Resolutions[screen.resolution];

        // Use the initial possition on the new screen to calculate the final position of a window
        const initialPossition = getCornerCoordonates(configuration.initialPossition, screen);
        position.x = initialPossition.x;
        position.y = initialPossition.y;

        isScreenChange = true;
        // S.log('The new origin to start from will be', initialPossition);
      }
    }

    // Determine the final window dimensions
    const fitted = fitWindowToScreen(wRect, screen, resolution, axis, isScreenChange);
    // S.log(fitted, screen.visibleSize, screen.visibleSize, resolution);
    const isFitOnlyCase = fitted.isFitOnlyCase;
    const height = fitted.height;
    const width = fitted.width;

    // Determine the final window possition on the screen
    let x = position.x;
    let y = position.y;

    if (!isFitOnlyCase || isScreenChange) {
      if (axis === 'x') {
        const columnSize = Math.floor(screen.visibleSize.width / resolution.columns);
        const localPositionX = position.x - screen.position.x;

        x = operate(Math.floor(localPositionX / columnSize) * columnSize, width, operation) + screen.position.x;
        S.log('About to determine X possition: ', {
          columnRation: position.x / columnSize,
          columnSize,
          operation,
          positionX: position.x,
          result: Math.floor(position.x / columnSize) * columnSize,
          width,
        });

        // Normalize x to fit the screen (don't allow out of bounds window placements)
        x = x < screen.position.xv ? // The window is underflowing the horizontal axis?
          screen.position.xv : // Fit to the minimum horizontal position (absolute 0)
          // The window is overflowing the horizontal axis?
          x + width > (screen.position.xv + screen.visibleSize.width) ?
            (screen.position.xv + screen.visibleSize.width) - width : // Fit the window to the horizontal axis (max)
            x; // Keep x as is
      } else {
        const rowSize = Math.floor(screen.visibleSize.height / resolution.rows);
        y = operate(Math.floor(position.y / rowSize) * rowSize, height, operation);

        // Normalize y to fit the screen (don't allow out of bounds window placements)
        y = y < screen.position.yv ? // The window is underflowing the vertical axis?
          screen.position.yv : // Fit to the minimum vertical position (absolute 0)
          // The window is overflowing the vertical axis?
          y + height > (screen.position.yv + screen.visibleSize.height) ?
            (screen.position.yv + screen.visibleSize.height) - height : // Fit the window to the horizontal axis (max)
            y; // Keep y as is
      }
    }

    // Move the window to the desired location
    return S.operation(Slate.Action.move, {
      height,
      screen: screen.ref,
      width,
      x,
      y,
    });
  };
}

/**
 * Given a screen and a window, tries to fit the window on the screen
 */
function fitWindowToScreen(
  wRect: Slate.RectArea, screen: IScreenDetails,
  resolution: IResolutin, axis: ISnapConfiguration['axis'],
  isScreenChange: boolean) {
  const columnSize = Math.floor(screen.visibleSize.width / resolution.columns);
  const rowSize = Math.floor(screen.visibleSize.height / resolution.rows);
  let isFitOnlyCase = false;

  let height = wRect.height;
  let width = wRect.width;

  if (axis === 'y' || isScreenChange) {
    // If the window height is smaller then a row
    if (wRect.height < rowSize) {
      // Make the window a row heigh
      height = rowSize;

      isFitOnlyCase = true; // Fit only case, a window should be at least the minimum division of an axis
    } else if (wRect.height > screen.visibleSize.height) {
      // If the window's height is greater then the screen height
      // Normalize the window to the full visible height
      height = screen.visibleSize.height;
    } else {
      // Normalize the window to the next full row unit
      height = Math.floor(wRect.height / rowSize) * rowSize;
    }
  }

  if (axis === 'x' || isScreenChange) {
    // If the window width is smaller then a column
    if (wRect.width < columnSize) {
      // Normalize the window to a full column width
      width = columnSize;

      isFitOnlyCase = true; // Fit only case, a window should be at least the minimum division of an axis
    } else if (wRect.width > screen.visibleSize.width) {
      // If the window's width is greater then the screen width
      // Normalize the window to the full visible width
      width = screen.visibleSize.width;
    } else {
      const columns = wRect.width / columnSize;

      // Normalize the window to the next full column unit
      width = Math.floor(wRect.width / columnSize) * columnSize;
      slate.log('Determined number of columns: ', columns, 'Final width: ', width);
    }
  }

  return { isFitOnlyCase, height, width };
}

/**
 * Extract the screen's corner coordonates
 */
function getCornerCoordonates(corner: ISnapConfiguration['corner'], screen: IScreenDetails) {
  return {
    x: corner.x === 'minScreenX' ? 0 : screen.visibleSize.width,
    y: corner.y === 'minScreenY' ? 0 : screen.visibleSize.height,
  };
}

/**
 * Given the operation type, execute the specified operation against the 2 numbers
 */
function operate(a: number, b: number, op: ISnapConfiguration['operation']) {
  if (op === 'add') {
    return a + b;
  }

  return a - b;
}

interface ISnapConfiguration {
  axis: 'x' | 'y';
  corner: IDescriptiveCoordinates & {
    inclusive?: boolean; // Determines if the window dimension will be accounted for when determining the corner match
  };
  direction: keyof IScreenDetails['neighbours'];
  initialPossition: IDescriptiveCoordinates;
  operation: 'add' | 'substract';
}

interface IDescriptiveCoordinates {
  x: 'minScreenX' | 'maxScreenX';
  y: 'minScreenY' | 'maxScreenY';
}
