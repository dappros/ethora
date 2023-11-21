module.exports = {
  plugins: [
    "react-native-reanimated/plugin",
    ["@babel/plugin-transform-flow-strip-types", { loose: true }], //https://github.com/facebook/react-native/issues/29084#issuecomment-1030732709
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["@babel/plugin-proposal-private-methods", { loose: true }],
    [
      "@babel/plugin-transform-react-jsx",
      {
        runtime: "automatic",
      },
    ],
  ],
  presets: ["module:metro-react-native-babel-preset"],
}
