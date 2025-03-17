import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (you can adjust these based on your design's base device)
const baseWidth = 375; // Standard iPhone width
const baseHeight = 812; // Standard iPhone height

// Scaling factors
const widthScale = SCREEN_WIDTH / baseWidth;
const heightScale = SCREEN_HEIGHT / baseHeight;

// Use this for scaling sizes that should scale with screen width
export const horizontalScale = (size) => {
  return PixelRatio.roundToNearestPixel(size * widthScale);
};

// Use this for scaling sizes that should scale with screen height
export const verticalScale = (size) => {
  return PixelRatio.roundToNearestPixel(size * heightScale);
};

// Use this for scaling fonts and elements that should scale moderately
export const moderateScale = (size, factor = 0.5) => {
  return PixelRatio.roundToNearestPixel(size + (horizontalScale(size) - size) * factor);
};

// Use this to get responsive padding/margin that maintains aspect ratio
export const responsiveSpacing = (size) => {
  const scale = Math.min(widthScale, heightScale);
  return PixelRatio.roundToNearestPixel(size * scale);
};

// Get screen dimensions
export const getScreenDimensions = () => {
  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  };
}; 