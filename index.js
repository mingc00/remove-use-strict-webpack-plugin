const { ModuleFilenameHelpers } = require('webpack');

class RemoveStrictTemplatePlugin {
  constructor(options) {
    this.options = options || {};
  }

  apply(moduleTemplate) {
    const USE_STRICT_STMT = '"use strict";\n';
    const { sourceFilter = () => true } = this.options;
    moduleTemplate.hooks.render.tap('RemoveStrictTemplatePlugin', (source, module) => {
      if (ModuleFilenameHelpers.matchObject(this.options, module.resource)) {
        const index = source.children.indexOf(USE_STRICT_STMT);
        if (index > -1 && sourceFilter(source) === true) {
          source.children.splice(index, 1, ';\n');
        }
      }
      return source;
    });
  }
}

class RemoveUseStrictPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const pluginName = 'RemoveUseStrictPlugin';
    compiler.hooks.make.tap(pluginName, compilation => {
      new RemoveStrictTemplatePlugin(this.options).apply(compilation.moduleTemplates.javascript);
    });
  }
}

module.exports = RemoveUseStrictPlugin;
