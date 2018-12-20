import { snapFactory } from './action.factory.snap';

export const snapRight = snapFactory({
  axis: 'x',
  corner: {
    inclusive: true, // The window has to be accounted for when determining the corner match
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
