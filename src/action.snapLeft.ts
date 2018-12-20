import { snapFactory } from './action.factory.snap';

export const snapLeft = snapFactory({
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
