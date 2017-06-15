var babel = require('babel-core')

module.exports = function (code) {
  var parsed = {}
  babel.transform(code, {
    plugins: [function ({ types: t }) {
      return {
        inherits: require('babel-plugin-syntax-jsx'),
        visitor: {
          ObjectProperty: function (path) {
            if (path.node.key.name === 'name' &&
              path.node.value.type === 'StringLiteral' &&
              path.parentPath.parent.type === 'ExportDefaultDeclaration') {
              parsed.componentName = path.node.value.value
            }
          }
        }
      }
    }]
  })
  return parsed
}
