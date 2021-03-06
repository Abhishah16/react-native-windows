/**
 * @format
 */
const fs = require('fs');
const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');

const rnwPath = __dirname;

module.exports = {
  // WatchFolders is only needed due to the yarn workspace layout of node_modules, we need to watch the symlinked locations separately
  watchFolders: [
    // Include hoisted modules
    path.resolve(__dirname, '../node_modules'),
  ],

  resolver: {
    resolveRequest: require('./metro-react-native-platform').reactNativePlatformResolver(
      {
        windesktop: 'react-native-windows',
        windows: 'react-native-windows',
      },
    ),
    extraNodeModules: {
      // Redirect react-native-windows to this folder
      'react-native-windows': rnwPath,
    },
  },
  transformer: {
    // The cli defaults this to a full path to react-native, which bypasses the reactNativePlatformResolver above
    // Hopefully we can fix the default in the future
    assetRegistryPath: 'react-native/Libraries/Image/AssetRegistry',
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};

// Check that we have built our JS files before running the bundler, otherwise we'll get a harder to diagnose "Unable to resolve module" error
if (
  !fs.existsSync(
    path.resolve(
      __dirname,
      'Libraries/Components/AccessibilityInfo/AccessibilityInfo.windows.js',
    ),
  )
) {
  throw new Error(
    '[31m\nThis package must be built before running the bundler.  Did you mean to run "[39m[33myarn build[39m[31m" first?[39m\n',
  );
}
