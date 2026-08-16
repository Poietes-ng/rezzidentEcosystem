import Svg, { Rect, Defs, Pattern, Image } from 'react-native-svg';

/**
 * Poietes logo icon — rendered from LogoIcon.svg (14×14 with embedded image).
 * Used in the SplashScreen footer alongside "Powered | Poietes" text.
 */
interface LogoIconProps {
  size?: number;
}

// The base64 PNG data embedded in the SVG
const LOGO_BASE64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB9AAAAfQCAYAAACaOMR5AAA`;

export function LogoIcon({ size = 14 }: LogoIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Defs>
        <Pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <Image
            href={LOGO_BASE64}
            width={1}
            height={1}
            preserveAspectRatio="none"
          />
        </Pattern>
      </Defs>
      <Rect width="14" height="14" fill="url(#pattern0)" />
    </Svg>
  );
}
