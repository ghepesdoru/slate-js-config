import * as Slate from 'slate-definition';

import { SlateConfigurator } from './configurator';

/**
 * Generic Action type definition
 * Accepts a slate window object and
 */
export type Action = (w: Slate.Window, c: SlateConfigurator) => Slate.Operation;
