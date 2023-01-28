module.exports = {
  project: {
    ios: {},
    android: {}, // grouped into "project"
  },
  assets: ['.src/assets/fonts'], // stays the same

  dependencies: {
    'react-native-video': {platforms: {android: {sourceDir: '../node_modules/react-native-video/android-exoplayer'}}},
  },
};
