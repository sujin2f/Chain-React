const preset = require('next/babel');

preset.plugins = removeStyledJsx(preset.plugins);

module.exports = preset;

function removeStyledJsx(plugins) {
  if (plugins !== undefined) {
    return plugins.filter(plugin => plugin.indexOf('styled-jsx') === -1);
  }
  return plugins;
}
