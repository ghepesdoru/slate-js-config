declare module 'slate-definition' {
  export const enum Action {
    'move' = 'move',
    'resize' = 'resize',
    'push' = 'push',
    'nudge' = 'nudge',
    'throw' = 'throw',
    'corner' = 'corner',
    'shell' = 'shell',
    'hide' = 'hide',
    'show' = 'show',
    'toggle' = 'toggle',
    'focus' = 'focus',
    'chain' = 'chain',
    'sequence' = 'sequence',
    'layout' = 'layout',
    'snapshot' = 'snapshot',
    'delete-snapshot' = 'delete-snapshot',
    'activate-snapshot' = 'activate-snapshot',
    'hint' = 'hint',
    'grid' = 'grid',
    'relaunch' = 'relaunch',
    'undo' = 'undo',
    'switch' = 'switch',
  }

  export type ActionParameters =
    IActionMoveParameters |
    IActionResizeParameters |
    IActionPushParameters |
    IActionNudgeParameters |
    IActionThrowParameters |
    IActionCornerParameters |
    IActionShellParameters |
    IActionHideParameters |
    IActionShowParameters |
    IActionToggleParameters |
    IActionFocusParameters |
    IActionChainParameters |
    IActionSequenceParameters |
    IActionLayoutParameters |
    IActionSnapshotParameters |
    IActionSnapshotDeleteParameters |
    IActionSnapshotActivateParameters |
    IActionHintParameters |
    IActionGridParameters |
    IActionRelaunchParameters |
    IActionUndoParameters |
    IActionSwitchParameters;

  type FnParameterString = () => string;
  type ParameterString = string | FnParameterString;
  type ParameterNumber = number | (() => number);
  type ParameterValue = ParameterString | ParameterNumber;

  /**
   * Anchor parameter values
   */
  const enum AnchorType {
    'top-left' = 'top-left',
    'top-right' = 'top-right',
    'bottom-left' = 'bottom-left',
    'bottom-right' = 'bottom-right',
  }

  /**
   * Push direction parameter values
   */
  enum PushDirectionType {
    'top' = 'top',
    'up' = 'up',
    'bottom' = 'bottom',
    'down' = 'down',
    'left' = 'left',
    'right' = 'right',
  }

  /**
   * Push style values
   */
  const enum PushStyleType {
    'none' = 'none',
    'center' = 'center',
    'bar' = 'bar',
    'bar-resize:expression' = 'bar-resize:expression',
  }

  /**
   * Corner direction parameter values
   */
  const enum CornerDirectionType {
    'top-left' = 'top-left',
    'top-right' = 'top-right',
    'bottom-left' = 'bottom-left',
    'bottom-right' = 'bottom-right',
  }

  /**
   * Focus direction parameter values
   */
  const enum FocusDirectionType {
    'right' = 'right',
    'left' = 'left',
    'up' = 'up',
    'above' = 'above',
    'down' = 'down',
    'below' = 'below',
    'behind' = 'behind',
  }

  /**
   * Move action
   */
  interface IActionMoveParameters {
    x: ParameterValue;
    y: ParameterValue;
    width: ParameterValue;
    height: ParameterValue;
    screen?: Screen;
  }

  /**
   * Resize action
   */
  interface IActionResizeParameters {
    width: ParameterString;
    height: ParameterString;
    anchor?: AnchorType | (() => AnchorType);
  }

  /**
   * Push action (pushes the window to the edge of the screen)
   */
  interface IActionPushParameters {
    direction: PushDirectionType | (() => PushDirectionType);
    style?: PushStyleType | (() => PushStyleType);
    screen?: Screen;
  }

  /**
   * Nudge a windows by specified ammount or percentage
   */
  interface IActionNudgeParameters {
    x: ParameterString;
    y: ParameterString;
  }

  /**
   * Throw the window to any screen's origin
   */
  interface IActionThrowParameters {
    screen: Screen;
    topLeftX?: ParameterValue;
    topLeftY?: ParameterValue;
    width?: ParameterValue;
    height?: ParameterValue;
  }

  /**
   * Move/resize the window into a corner
   */
  interface IActionCornerParameters {
    direction: CornerDirectionType;
    width?: ParameterValue;
    height?: ParameterValue;
    screen?: Screen;
  }

  /**
   * Execute a shell action
   */
  interface IActionShellParameters {
    command: ParameterString;
    waitForExit?: boolean;
    workingDirectory?: undefined | ParameterString;
  }

  /**
   * Hide one or more applications
   */
  interface IActionHideParameters {
    app: string | string[] | (() => string | string[]);
  }

  /**
   * Show one or more applications
   */
  interface IActionShowParameters {
    app: string | string[] | (() => string | string[]);
  }

  /**
   * Show one or more applications
   */
  interface IActionToggleParameters {
    app: string | string[] | (() => string | string[]);
  }

  /**
   * Focus a window in a direction or from an application
   */
  type IActionFocusParameters = IActionFocusParametersApp | IActionFocusParametersDirection;
  interface IActionFocusParametersApp {
    app: ParameterString;
  }
  interface IActionFocusParametersDirection {
    direction: FocusDirectionType;
  }

  /**
   * Chain multiple operations to one bind
   */
  interface IActionChainParameters {
    operations: Operation[];
  }

  /**
   * Sequence multiple operations to one bind
   */
  interface IActionSequenceParameters {
    operations: Operation[];
  }

  /**
   * Activate a layout
   */
  interface IActionLayoutParameters {
    name: ParameterString;
  }

  /**
   * Creates a snapshot
   */
  interface IActionSnapshotParameters {
    name: ParameterString;
    save?: boolean;
    stack?: boolean | undefined;
  }

  /**
   * Delete a snapshot
   */
  interface IActionSnapshotDeleteParameters {
    name: string;
    all?: boolean;
  }

  /**
   * Activate a snapshot
   */
  interface IActionSnapshotActivateParameters {
    name: string;
    delete?: boolean;
  }

  /**
   * Display hints for each window
   */
  interface IActionHintParameters {
    characters?: ParameterString | undefined;
  }

  /**
   * Show a grid
   */
  interface IActionGridParameters {
    grids: {
      [screenReference: string]: { width: number; height: number; }
    };
    padding?: ParameterNumber;
  }

  /**
   * Relaunch Slate
   */
  interface IActionRelaunchParameters {}

  /**
   * Undo last action
   */
  interface IActionUndoParameters {}

  /**
   * Enable a different application switcher
   */
  interface IActionSwitchParameters {}

  type RectArea = { x: number; y: number; width: number; height: number };

  /**
   * Window object, represents a window
   */
  export class Window {
    public title(): string;
    public topLeft(): number;
    public tl(): number;
    public size(): { width: number; height: number };
    public rect(): RectArea;
    public pid(): number | string;
    public focus(): boolean;
    public isMinimizedOrHidden(): boolean;
    public isMain(): boolean;
    public move(params: { x: ParameterValue; y: ParameterValue; screen: ParameterValue; }): boolean;
    public isMovable(): boolean;
    public resize(params: { width: ParameterValue; height: ParameterValue; }): boolean;
    public isResizable(): boolean;
    public doOperation(operation: Operation): boolean;
    public screen(): Screen;
    public app(): Application;
  }

  /**
   * Application object
   */
  export class Application {
    public pid(): number | string;
    public name(): string;
    public eachWindow(fn: (w: Window) => void): undefined;
    public ewindow(fn: (w: Window) => void): undefined;
    public mainWindow(): Window | undefined;
    public mwindow(): Window | undefined;
  }

  /**
   * Screen object, represents a screen
   */
  export class Screen {
    public id(): number;
    public rect(): RectArea;
    public visibleRect(): RectArea;
    public isMain(): boolean;
  }

  /**
   * Operation object
   */
  export class Operation {
    public run(): undefined;
    public dup(): Operation;
  }

  type LayoutParameter = {};

  const enum SlateWindowEvent {
    'windowOpened' = 'windowOpened',
    'windowClosed' = 'windowClosed',
    'windowMoved' = 'windowMoved',
    'windowResized' = 'windowResized',
    'windowFocused' = 'windowFocused',
    'windowTitleChanged' = 'windowTitleChanged',
  }

  const enum SlateApplicationEvent {
    'appOpened' = 'appOpened',
    'appClosed' = 'appClosed',
    'appHidden' = 'appHidden',
    'appUnhidden' = 'appUnhidden',
    'appActivated' = 'appActivated',
    'appDeactivated' = 'appDeactivated',
  }

  const enum SlateScreenEvent {
    'screenConfigurationChanged' = 'screenConfigurationChanged'
  }

  type SlateEventTypes = {
    [windowEventName in (SlateWindowEvent | SlateApplicationEvent | SlateScreenEvent)]: any;
  };
  export type SlateEvents = keyof SlateEventTypes;

  export class Slate {
    public bind(keystroke: string, operation: Operation | ((w: Window) => void), repeat?: boolean);
    public bindAll(operations: {
      [keystroke: string]: Operation | ((w: Window) => void) | Array<Operation | boolean>;
    });
    public config(name: string, value: string | number | boolean | Array<string | number | boolean> | (() => string | number | boolean | Array<string | number | boolean>))
    public configAll(config: {
      [name: string]: string | number | boolean | Array<string | number | boolean> | (() => string | number | boolean | Array<string | number | boolean>);
    });
    public operation(name: Action, params: ActionParameters): Operation;
    public operationFromString(operationString: string);
    public layout(name: string, layout: {
      [applicationName: string]: LayoutParameter;
    });
    // public default() // TODO:
    // public source() // TODO:
    public on(event: SlateWindowEvent, fn: ((event: any, window: Window) => void));
    public on(event: SlateApplicationEvent, fn: ((event: any, application: Application) => void));
    public on(event: SlateScreenEvent, fn: ((event: any, screen: Screen) => void));
    // public shell() // TODO:
    public window(): Window;
    public windowUnderPoint(coord: { x: ParameterValue; y: ParameterValue; }): Window;
    public app(): Application;
    public eachApp(fn: (app: Application) => void);
    public screen(): Screen;
    public screenCount(): number;
    public screenForRef(idOrResolution: string): Screen;
    public screenUnderPoint(coord: { x: ParameterValue; y: ParameterValue; }): Screen;
    public isPointOffScreen(coord: { x: ParameterValue; y: ParameterValue; }): boolean;
    public isPointOffScreen(coord: { x: ParameterValue; y: ParameterValue; width: number; height: number; }): boolean;
    public eachScreen(fn: (screen: Screen) => void);
    public log(...message: any);
  }
}
