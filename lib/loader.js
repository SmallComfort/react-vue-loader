const path = require('path')
const loaderUtils = require('loader-utils')
const parse = require('./parser')
const getRequireModule = require('./getRequireModule/index.js')
const outputFile = require('./utils/output-file')

module.exports = function (content) {
  this.cacheable()

  const loaderContext = this
  const query = loaderUtils.getOptions(this) || {}

  const options = this.options.__vueOptions__ = Object.assign({}, this.options.vue, this.vue, query)

  const filePath = this.resourcePath
  const fileName = path.basename(filePath)
  const parts = parse(content, fileName, this.sourceMap)
  const getRequire = getRequireModule.call(this)
  let cssScoped = false

  let output = ''

  // add requires for styles
  let cssModules
  if (parts.styles.length) {
    let hasModules = false
    parts.styles.forEach(function (style, i) {
      // require style
      let requireString = getRequire('styles', style, i, style.scoped)
      if (style.scoped === true) {
        cssScoped = true
      }

      const moduleName = (style.module === true) ? '$style' : style.module
      // setCssModule
      if (moduleName) {
        if (!cssModules) {
          cssModules = {}
        }
        if (!hasModules) {
          hasModules = true
          output += 'var cssModules = {};'
        }
        if (moduleName in cssModules) {
          loaderContext.emitError('CSS module name "' + moduleName + '" is not unique!')
          output += requireString
        } else {
          cssModules[moduleName] = true

          // `(vue-)style-loader` exposes the name-to-hash map directly
          // `css-loader` exposes it in `.locals`
          // add `.locals` if the user configured to not use style-loader.
          if (requireString.indexOf('style-loader') < 0) {
            requireString += '.locals'
          }

          output += `cssModules["${moduleName}"] = ${requireString};`
        }
      } else {
        output += requireString + ';'
      }
    })
  }
  output += '\n\n'

  const templateRequire = getRequire('template', parts.template, 0, cssScoped)
  output += `var render = ${templateRequire};`
  output += `render = render.default || render;`
  output += '\n\n'

  const optionsRequire = getRequire('script', Object.assign({}, parts.script, { options: true }))
  output += `var options = ${optionsRequire};`
  output += `options = options.default || options || {};`
  output += '\n\n'

  const buildRequire = getRequire('script', parts.script)
  output += `var build = ${buildRequire};`
  output += `build = build.default || build;`
  output += '\n\n'

  output += `var Component = build(render, Object.assign({}, options, {__file: ${JSON.stringify(filePath)}})${cssModules ? ', cssModules' : ''});`
  output += '\n\n'

  output += `options.name && Object.defineProperty(Component, "name", { value: options.name });`
  output += '\n\n'

  if (options.esModule) {
    output += `exports.__esModule = true;`
    output += `exports["default"] = Component;`
  } else {
    output += `module.exports = Component;`
  }

  outputFile.call(this, output)

  return output
}
