const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("cjs");

const tslibPath = path.resolve(__dirname, "node_modules/tslib/tslib.es6.js");

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "tslib") {
    return context.resolveRequest(context, tslibPath, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, {
  input: "./src/global.css",
  inlineRem: 16,
});
