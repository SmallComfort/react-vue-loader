var loaderUtils = require('loader-utils')
var compiler = require('react-vue-template-compiler')
var transformRequire = require('./modules/transform-require')
var addvm = require('./plugins/addvm')

module.exports = function (html) {
  this.cacheable()
  var options = loaderUtils.getOptions(this) || {}
  var vueOptions = Object.assign({}, this.vue, options)

  var defaultModules = [transformRequire(options.transformToRequire)]
  var userModules = vueOptions.compilerModules || options.compilerModules
  // for HappyPack cross-process use cases
  if (typeof userModules === 'string') {
    userModules = require(userModules)
  }
  var compilerOptions = {
    preserveWhitespace: vueOptions.preserveWhitespace,
    modules: defaultModules.concat(userModules || []),
    vueConfig: {
      scopeId: options.scoped && options.id
    }
  }

  try {
    var compiled = compiler.compile(html, compilerOptions)
  } catch (e) {
    console.error(e)
  }

  // tips
  if (compiled.tips && compiled.tips.length) {
    compiled.tips.forEach(tip => {
      this.emitWarning(tip)
    })
  }

  var code
  if (compiled.errors && compiled.errors.length) {
    this.emitError(
      `\n  Error compiling template:\n${pad(html)}\n` +
      compiled.errors.map(e => `  - ${e}`).join('\n') + '\n'
    )
    code = 'module.exports=function render(){}'
  } else {
    try {
      code = addvm(compiled.code)
    } catch (e) {
      console.error(e)
    }
  }

  return code
}

function pad (html) {
  return html.split(/\r?\n/).map(line => `  ${line}`).join('\n')
}
