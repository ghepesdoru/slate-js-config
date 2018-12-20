import { snapFactory } from './action.factory.snap';

export const snapDown = snapFactory({
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
