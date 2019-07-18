var postcss = require('postcss')
var loaderUtils = require('loader-utils')
var loadPostcssConfig = require('./load-postcss-config')

var trim = require('./plugins/trim')
var scopeId = require('./plugins/scope-id')

module.exports = function (css, map) {
  this.cacheable()
  var cb = this.async()

  var query = loaderUtils.getOptions(this) || {}
  var vueOptions = Object.assign({}, this.vue, query)

  loadPostcssConfig(this, vueOptions.postcss).then(config => {
    var plugins = [trim].concat(config.plugins)
    var options = Object.assign({
      to: this.resourcePath,
      from: this.resourcePath,
      map: false
    }, config.options)

    // add plugin for vue-loader scoped css rewrite
    if (query.scoped) {
      plugins.push(scopeId({ id: query.id }))
    }

    // source map
    if (
      this.sourceMap &&
      !this.minimize &&
      vueOptions.cssSourceMap !== false &&
      process.env.NODE_ENV !== 'production' &&
      !options.map
    ) {
      options.map = {
        inline: false,
        annotation: false,
        prev: map
      }
    }

    return postcss(plugins)
      .process(css, options)
      .then(result => {
        if (result.messages) {
          result.messages.forEach(m => {
            if (m.type === 'dependency') {
              this.addDependency(m.file)
            }
          })
        }
        var map = result.map && result.map.toJSON()
        cb(null, result.css, map)
        return null // silence bluebird warning
      })
  }).catch(e => {
    console.error(e)
    cb(e)
  })
}
