// TypeScript type for cross-platform LottieView
import { ComponentType } from 'react';

export interface LottieProps {
  source?: any; // for native
  animationData?: any; // for web
  autoPlay?: boolean;
  loop?: boolean;
  style?: any;
  [key: string]: any;
}

declare const LottieView: ComponentType<LottieProps>;
export default LottieView;
