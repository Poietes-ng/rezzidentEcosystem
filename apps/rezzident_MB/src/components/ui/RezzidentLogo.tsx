import Svg, { Path } from 'react-native-svg';

/**
 * Rezzident logo icon — rendered from logo.svg path data.
 * The yellow angular mark that represents the brand.
 *
 * Usage: <RezzidentLogo width={26} height={24} />
 * For white variant: <RezzidentLogo fill="#FFFFFF" />
 */
interface RezzidentLogoProps {
  width?: number;
  height?: number;
  fill?: string;
}

export function RezzidentLogo({
  width = 26,
  height = 24,
  fill = '#FFE022',
}: RezzidentLogoProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 26 24" fill="none">
      <Path
        d="M26 24H0L17.2059 8.12903V0H21.4118V3.87097L26 0V24Z"
        fill={fill}
      />
    </Svg>
  );
}
