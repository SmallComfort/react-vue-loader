const path = require('path')
// const parser = require('./modules/parser')
const loaderUtils = require('loader-utils')
const changeCase = require('change-case')

const ANONYMOUS_COMPONENT = 'AnonymousComponent'

module.exports = function (script) {
  this.cacheable()
  const loaderContext = this
  const query = loaderUtils.getOptions(this) || {}
  const parsedPath = path.parse(this.resourcePath)
  const importStr = commonImport(query)
  // const parsed = parser(script)
  // const componentStr = buildComponent(parsed.componentName || query.name || parsedPath.name || ANONYMOUS_COMPONENT)
  const varyImportStr = varyImport(loaderContext, query)
  const componentStr = buildComponent(query.name || parsedPath.name || ANONYMOUS_COMPONENT, query)
  const output = importStr + varyImportStr + componentStr
  return output
}

function commonImport () {
  return (
    `import Vue, { observer } from 'react-vue'\n
    import { Component } from 'react'\n
    import PropTypes from 'prop-types'\n
    import { buildComponent, platformDirectives} from 'react-vue-helper'\n`
  )
}

function varyImport (loaderContext, query) {
  let code = ''
  if (query.vue) {
    let absoluteVue = query.vue
    if (!path.isAbsolute(query.vue)) {
      absoluteVue = path.resolve(process.cwd(), query.vue)
    }
    code = `import _Vue from ${loaderUtils.stringifyRequest(loaderContext, absoluteVue)}\n`
  } else {
    code = `const _Vue = null\n`
  }
  return code
}

function buildComponent (name, query) {
  return (
    `export default (render, options, cssModules) => {
      options.directives = Object.assign({}, options.directives, platformDirectives)
      return observer(
        class ${changeCase.pascalCase(name)} extends buildComponent(
          render, options, {Component, PropTypes, Vue: _Vue || Vue, cssModules}
        ) {}
      )
    }`
  )
}
