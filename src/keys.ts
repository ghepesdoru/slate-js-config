import { Action } from './action';

import { snapDown } from './action.snapDown';
import { snapLeft } from './action.snapLeft';
import { snapRight } from './action.snapRight';
import { snapUp } from './action.snapUp';

/**
 * Keys module defines a map of all supported actions and their respective key bindings,
 */
export interface IAction {
  keybinding: string;
  action: Action;
}

export const Actions: IAction[] = [
  /**
   * Configure your desired keybindings here
   * The option of disabling certain behaviours is also pressent
   */
  {
    action: snapLeft,
    keybinding: 'left:ctrl,cmd',
  },
  {
    action: snapRight,
    keybinding: 'right:ctrl,cmd',
  },
  {
    action: snapUp,
    keybinding: 'up:ctrl,cmd',
  },
  {
    action: snapDown,
    keybinding: 'down:ctrl,cmd',
  },
];
