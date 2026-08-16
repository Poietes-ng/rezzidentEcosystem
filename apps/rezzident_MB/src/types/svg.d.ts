/**
 * Type declarations for SVG assets imported via react-native-svg-transformer.
 * This lets TypeScript treat `require('@/assets/logo.svg')` as a valid
 * React component (SvgProps-compatible) rather than a module error.
 */
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
