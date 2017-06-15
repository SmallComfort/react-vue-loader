const path = require('path')
const fs = require('fs')
const loaderUtils = require('loader-utils')
const beautify = require('js-beautify').js_beautify

module.exports = function (content) {
  this.cacheable()
  const query = loaderUtils.getOptions(this) || {}
  const parsedPath = path.parse(this.resourcePath)

  if (query.output !== undefined) {
    let output = query.output
    let type = query.type
    if (output === true) {
      output = '.react'
    } else if (output === '') {
      output = ''
    } else {
      output = `.${output}`
    }
    if (typeof type === 'undefined') {
      type = ''
    } else if (typeof type === 'string') {
      type = `.${type}`
    }
    const outputPath = path.resolve(parsedPath.dir, `${parsedPath.name}${output}${type}.js`)
    fs.writeFile(outputPath, beautify(content.replace(/^[\/\/\s]*/, ''), { 'indent_size': 2 }), 'utf8')
  }
  return content
}
