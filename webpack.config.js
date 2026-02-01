const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const Dotenv = require("dotenv-webpack");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: argv.mode,
    entry: "./src/main.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? "[name].[contenthash].js" : "[name].js",
      clean: true,
      publicPath: isProduction ? "/metcast/" : "/",
    },
    resolve: {
      extensions: [".ts", ".js", ".vue", ".json"],
      alias: {
        "@": path.resolve(__dirname, "src"),
        vue: "vue/dist/vue.esm-bundler.js",
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.ts$/,
          loader: "ts-loader",
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new Dotenv({
        path: "./.env",
        safe: false,
        systemvars: true,
      }),
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(false),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
    ],
    devServer: {
      port: 8080,
      hot: true,
      open: true,
    },
    devtool: isProduction ? false : "eval-source-map",
  };
};
