const path = require("path");
const lib = path.resolve(__dirname);
const outputFolder = path.resolve(__dirname, "lib");

const webpack = require("webpack");
const { merge } = require("webpack-merge");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const common = {
  entry: {
    main: path.resolve(lib, "app.js"),
    "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: outputFolder,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
    ],
  },
  target: "web",
  mode: 'development',
  resolve: {
    extensions: [".js", ".json", ".ttf"],
    modules: ["node_modules"],
    fallback: {
    },
  },
};
 
  module.exports = merge(common, {
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
    ],
  });
