//
//  babel.config.js
//  vie dashboard forecast
//
//  Created by Jake Bass on 3/31/25.
//

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: []
  };
};