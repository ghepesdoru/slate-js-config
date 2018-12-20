import { snapFactory } from './action.factory.snap';

export const snapUp = snapFactory({
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
