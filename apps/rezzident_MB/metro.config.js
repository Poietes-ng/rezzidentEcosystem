const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// ── SVG support via react-native-svg-transformer ──
// SVGs are transformed into React components; all other assets use
// the default Metro asset handling (including .png, .jpg, etc.).
const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

// ── Monorepo support ──
// Resolve modules from both this app's node_modules and the workspace root's
// (pnpm hoists shared deps to the root).
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
// Let Metro follow pnpm's symlinked packages/* (e.g. @rezzident/design-tokens).
config.resolver.unstable_enableSymlinks = true;

module.exports = withNativeWind(config, { input: './src/global.css' });
