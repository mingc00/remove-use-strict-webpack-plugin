const { ModuleFilenameHelpers } = require('webpack');

class RemoveUseStrictPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const pluginName = 'RemoveUseStrictPlugin';
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      const hooks = compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(
        compilation
      );
      const { sourceFilter = () => true } = this.options;
      hooks.renderModuleContent.tap(pluginName, (moduleSource, module) => {
        if (module.buildInfo.strict &&
            ModuleFilenameHelpers.matchObject(this.options, module.resource) &&
            sourceFilter(moduleSource) === true) {
          module.buildInfo.strict = false;
        }
      });
    });
  }
}

module.exports = RemoveUseStrictPlugin;
