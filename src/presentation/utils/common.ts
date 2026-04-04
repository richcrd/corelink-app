import { Dimensions, PixelRatio } from 'react-native';

export const formatCurrency = (value: number | string) => {
  return new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(Number(value));
};

const { width: screen_width, height: screen_height } = Dimensions.get('window');
const density = PixelRatio.get();

// Converts density-independent pixels (dp) to actual pixels (px).
export const toPx = (dp: any) => Math.round(dp * density);

// Converts pixels (px) to density-independent pixels (dp).
export const toDp = (px: any) => Math.round(px / density);

// Calculates the recommended asset dimensions for a component.
export const getComponentPixelSize = (widthDp: any, heightDp: any) => {
  return {
    widthPx: toPx(widthDp),
    heightPx: toPx(heightDp),
    density: density,
  };
};

// Helper to calculate dimensions based on screen width percentage and aspect ratio
export const getResponsiveDimensions = (percentage = 1, aspectRatio = 1, margin = 0) => {
  const widthDp = (screen_width - margin) * percentage;
  const heightDp = widthDp / aspectRatio;

  return {
    widthDp,
    heightDp,
    widthPx: toPx(widthDp),
    heightPx: toPx(heightDp),
  };
};

export default {
  screen_width,
  screen_height,
  density,
  toPx,
  toDp,
  getComponentPixelSize,
  getResponsiveDimensions,
};