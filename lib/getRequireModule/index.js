const path = require('path')
const querystring = require('querystring')
const loaderUtils = require('loader-utils')
const genId = require('../utils/gen-id')
const normalize = require('../utils/normalize')
const tryRequire = require('../utils/try-require')

// internal lib loaders
const selectorPath = normalize.lib('selector')
const styleCompilerPath = normalize.lib('style-compiler/index')
const scriptCmopilerPath = normalize.lib('script-compiler/index')
const templateCompilerPath = normalize.lib('template-compiler/index')
const templatePreprocessorPath = normalize.lib('template-compiler/preprocessor')
const outputFilePath = normalize.lib('utils/output-file')

// check whether default js loader exists
const hasBabel = !!tryRequire('babel-loader')
const hasBuble = !!tryRequire('buble-loader')

const rewriterInjectRE = /\b(css(?:-loader)?(?:\?[^!]+)?)(?:!|$)/

const defaultLang = {
  template: 'html',
  styles: 'css',
  script: 'js'
}

// When extracting parts from the source vue file, we want to apply the
// loaders chained before vue-loader, but exclude some loaders that simply
// produces side effects such as linting.
function getRawRequest (context, excludedPreLoaders) {
  excludedPreLoaders = excludedPreLoaders || /eslint-loader/
  return loaderUtils.getRemainingRequest({
    resource: context.resource,
    loaderIndex: context.loaderIndex,
    loaders: context.loaders.filter(loader => !excludedPreLoaders.test(loader.path))
  })
}

module.exports = function () {
  const isProduction = this.minimize || process.env.NODE_ENV === 'production'

  const loaderContext = this
  const query = loaderUtils.getOptions(this) || {}

  const options = Object.assign({}, this.vue, query)
  const rawRequest = getRawRequest(this, options.excludedPreLoaders)

  const filePath = this.resourcePath
  const fileName = path.basename(filePath)

  const context = (this._compiler && this._compiler.context) || process.cwd()
  const moduleId = 'data-v-' + genId(filePath, context, options.hashKey)

  var cssLoaderOptions = ''
  if (!isProduction && this.sourceMap && options.cssSourceMap !== false) {
    cssLoaderOptions += '?sourceMap'
  }
  if (isProduction) {
    cssLoaderOptions += (cssLoaderOptions ? '&' : '?') + 'minimize'
  }

  var bubleOptions = hasBuble && options.buble
    ? '?' + JSON.stringify(options.buble)
    : ''

  const buildInLoader = (hasBuble ? ('buble-loader' + bubleOptions) : hasBabel ? 'babel-loader' : '')

  const defaultLoaders = {
    html: buildInLoader,
    css: options.extractCSS
      ? getCSSExtractLoader()
      : 'vue-style-loader' + '!' + 'css-loader' + cssLoaderOptions,
    js: buildInLoader
  }

  // check if there are custom loaders specified via
  // webpack config, otherwise use defaults
  let loaders = Object.assign({}, defaultLoaders, options.loaders)
  const preLoaders = options.preLoaders || {}
  const postLoaders = options.postLoaders || {}

  return function (type, part, index, scoped) {
    if (type === 'template') {
      defaultLoaders.html = `${buildInLoader}!${outputFilePath}?${
        JSON.stringify({
          output: query.output,
          type: 'render'
        })
      }!${templateCompilerPath}?${
        JSON.stringify({
          id: moduleId,
          scoped: !!scoped,
          transformToRequire: options.transformToRequire,
          preserveWhitespace: options.preserveWhitespace,
          buble: options.buble,
          // only pass compilerModules if it's a path string
          compilerModules: typeof options.compilerModules === 'string'
            ? options.compilerModules
            : undefined
        })
      }`
    } else if (type === 'script') {
      if (part.options === true) {
        defaultLoaders.js = `${buildInLoader}!${outputFilePath}?${
          JSON.stringify({
            output: query.output,
            type: 'options'
          })
        }`
      } else {
        defaultLoaders.js = `${buildInLoader}!${outputFilePath}?${
          JSON.stringify({
            output: query.output,
            type: 'component'
          })
        }`
      }
    }

    loaders = Object.assign({}, defaultLoaders, options.loaders)

    if (part && part.src) {
      return getRequireForImport(type, part, index, scoped)
    } else {
      return getRequire(type, part, index, scoped)
    }
  }

  function getRequire (type, part, index, scoped) {
    return 'require(' +
      getRequireString(type, part, index, scoped) +
    ')'
  }

  function getRequireString (type, part, index, scoped) {
    return loaderUtils.stringifyRequest(loaderContext,
      // disable all configuration loaders
      '!!' +
      // get loader string for pre-processors
      getLoaderString(type, part, index, scoped) +
      // select the corresponding part from the vue file
      getSelectorString(type, index || 0) +
      // the url to the actual vue file, including remaining requests
      rawRequest
    )
  }

  function getRequireForImport (type, part, index, scoped) {
    return 'require(' +
      getRequireForImportString(type, part, index, scoped) +
    ')'
  }

  function getRequireForImportString (type, part, index, scoped) {
    return loaderUtils.stringifyRequest(loaderContext,
      '!!' +
      getLoaderString(type, part, -1, scoped) +
      part.src
    )
  }

  function addCssModulesToLoader (loader, part, index) {
    if (!part.module) return loader
    var option = options.cssModules || {}
    var DEFAULT_OPTIONS = {
      modules: true,
      importLoaders: true
    }
    var OPTIONS = {
      localIdentName: '[hash:base64]'
    }
    return loader.replace(/((?:^|!)css(?:-loader)?)(\?[^!]*)?/, function (m, $1, $2) {
      // $1: !css-loader
      // $2: ?a=b
      var query = loaderUtils.parseQuery($2 || '?')
      Object.assign(query, OPTIONS, option, DEFAULT_OPTIONS)
      if (index !== -1) {
        // Note:
        //   Class name is generated according to its filename.
        //   Different <style> tags in the same .vue file may generate same names.
        //   Append `_[index]` to class name to avoid this.
        query.localIdentName += '_' + index
      }
      return $1 + '?' + JSON.stringify(query)
    })
  }

  function buildCustomBlockLoaderString (attrs) {
    var noSrcAttrs = Object.assign({}, attrs)
    delete noSrcAttrs.src
    var qs = querystring.stringify(noSrcAttrs)
    return qs ? '?' + qs : qs
  }

  // stringify an Array of loader objects
  function stringifyLoaders (loaders) {
    return loaders.map(function (obj) {
      return obj && typeof obj === 'object' && typeof obj.loader === 'string'
        ? obj.loader + (obj.options ? '?' + JSON.stringify(obj.options) : '')
        : obj
    }).join('!')
  }

  function getLoaderString (type, part, index, scoped) {
    var loader = getRawLoaderString(type, part, index, scoped)
    var lang = getLangString(type, part)
    if (preLoaders[lang]) {
      loader = loader + ensureBang(preLoaders[lang])
    }
    if (postLoaders[lang]) {
      loader = ensureBang(postLoaders[lang]) + loader
    }
    return loader
  }

  function getLangString (type, part) {
    if (type === 'script' || type === 'template' || type === 'styles') {
      return part.lang || defaultLang[type]
    } else {
      return type
    }
  }

  function getRawLoaderString (type, part, index, scoped) {
    var lang = (part && part.lang) || defaultLang[type]

    var styleCompiler = ''
    if (type === 'styles') {
      // style compiler that needs to be applied for all styles
      styleCompiler = styleCompilerPath + '?' + JSON.stringify({
        // a marker for vue-style-loader to know that this is an import from a vue file
        vue: true,
        id: moduleId,
        scoped: !!scoped,
        hasInlineConfig: !!query.postcss
      }) + '!'
      // normalize scss/sass if no specific loaders have been provided
      if (!loaders[lang]) {
        if (lang === 'sass') {
          lang = 'sass?indentedSyntax'
        } else if (lang === 'scss') {
          lang = 'sass'
        }
      }
    }

    var loader = loaders[lang]
    if (type === 'styles') {
      if (options.extractCSS) {
        loader = loader || getCSSExtractLoader(lang)
      }
    }

    // var loader = options.extractCSS
    //   ? loaders[lang] || getCSSExtractLoader(lang)
    //   : loaders[lang]

    if (type === 'script') {
      if (part.options !== true) {
        loader += `!${scriptCmopilerPath}?${JSON.stringify({
          name: fileName.split('.')[0],
          vue: options.vue
        })}`
      }
    }

    // if (type === 'template') {
    // }

    var injectString = (type === 'script' && query.inject)
      ? 'inject-loader!'
      : ''

    if (loader != null) {
      if (Array.isArray(loader)) {
        loader = stringifyLoaders(loader)
      } else if (typeof loader === 'object') {
        loader = stringifyLoaders([loader])
      }
      if (type === 'styles') {
        // add css modules
        loader = addCssModulesToLoader(loader, part, index)
        // inject rewriter before css loader for extractTextPlugin use cases
        if (rewriterInjectRE.test(loader)) {
          loader = loader.replace(rewriterInjectRE, function (m, $1) {
            return ensureBang($1) + styleCompiler
          })
        } else {
          loader = ensureBang(loader) + styleCompiler
        }
      }
      // if user defines custom loaders for html, add template compiler to it
      if (type === 'template' && loader.indexOf(defaultLoaders.html) < 0) {
        loader = defaultLoaders.html + '!' + loader
      }
      return injectString + ensureBang(loader)
    } else {
      // unknown lang, infer the loader to be used
      switch (type) {
        case 'template':
          return defaultLoaders.html + '!' + templatePreprocessorPath + '?raw&engine=' + lang + '!'
        case 'styles':
          loader = addCssModulesToLoader(defaultLoaders.css, part, index)
          return loader + '!' + styleCompiler + ensureBang(ensureLoader(lang))
        case 'script':
          return injectString + ensureBang(ensureLoader(lang))
        default:
          loader = loaders[type]
          if (Array.isArray(loader)) {
            loader = stringifyLoaders(loader)
          }
          return ensureBang(loader + buildCustomBlockLoaderString(part.attrs))
      }
    }
  }

  // sass => sass-loader
  // sass-loader => sass-loader
  // sass?indentedSyntax!css => sass-loader?indentedSyntax!css-loader
  function ensureLoader (lang) {
    return lang.split('!').map(function (loader) {
      return loader.replace(/^([\w-]+)(\?.*)?/, function (_, name, query) {
        return (/-loader$/.test(name) ? name : (name + '-loader')) + (query || '')
      })
    }).join('!')
  }

  function getSelectorString (type, index) {
    return selectorPath +
      '?type=' + ((type === 'script' || type === 'template' || type === 'styles') ? type : 'customBlocks') +
      '&index=' + index + '!'
  }

  function ensureBang (loader) {
    if (loader.charAt(loader.length - 1) !== '!') {
      return loader + '!'
    } else {
      return loader
    }
  }

  function getCSSExtractLoader (lang) {
    var extractor
    var op = options.extractCSS
    // extractCSS option is an instance of ExtractTextPlugin
    if (typeof op.extract === 'function') {
      extractor = op
    } else {
      extractor = tryRequire('extract-text-webpack-plugin')
      if (!extractor) {
        throw new Error(
          '[vue-loader] extractCSS: true requires extract-text-webpack-plugin ' +
          'as a peer dependency.'
        )
      }
    }
    var langLoader = lang
      ? ensureBang(ensureLoader(lang))
      : ''
    return extractor.extract({
      use: 'css-loader' + cssLoaderOptions + '!' + langLoader,
      fallback: 'vue-style-loader'
    })
  }
}
