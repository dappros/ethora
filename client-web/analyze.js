process.env.NODE_ENV = "production"

const webpack = require("webpack")
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const webpackConfigProduction = require("react-scripts/config/webpack.config")(
  "production"
)

// this one is optional, just for better feedback on build

// pushing BundleAnalyzerPlugin to plugins array
webpackConfigProduction.plugins.push(new BundleAnalyzerPlugin())

// optional - pushing progress-bar plugin for better feedback;
// it can and will work without progress-bar,
// but during build time you will not see any messages for 10-60 seconds (depends on the size of the project)
// and decide that compilation is kind of hang up on you; progress bar shows nice progression of webpack compilation

// actually running compilation and waiting for plugin to start explorer
webpack(webpackConfigProduction, (error, stats) => {
  if (error || stats.hasErrors()) {
    console.error(error)
  }
})
