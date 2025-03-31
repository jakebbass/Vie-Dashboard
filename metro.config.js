// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Remove the "isThirdPartyModule" option if it exists.
if (defaultConfig.serializer && defaultConfig.serializer.isThirdPartyModule) {
  delete defaultConfig.serializer.isThirdPartyModule;
}

module.exports = defaultConfig;