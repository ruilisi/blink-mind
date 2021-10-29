import configurePackage from './support/rollup/configure-package';

import core from './packages/core/package.json';
import rendererReact from './packages/renderer-react/package.json';
import themeSelectorPlugin from './packages/plugin-theme-selector/package.json';
import jsonSerializerPlugin from  './packages/plugin-json-serializer/package.json';
import plugins from './packages/plugins/package.json'

const configs = [
  ...configurePackage(core),
  ...configurePackage(rendererReact),
  ...configurePackage(themeSelectorPlugin),
  ...configurePackage(jsonSerializerPlugin),
  ...configurePackage(plugins)
];

export default configs;
