import {
  renderList as __react__vue__renderList,
  bindWebClass as __react__vue__bindClass,
  _toString as __react__vue__toString
} from 'react-vue-helper';
import {
  createElement as __react__vue__createElement,
  Component as __react__vue__Component
} from 'react';
export default function render(vm) {
  return __react__vue__createElement('section', Object.assign({}, this.props.__react__vue__nativeEvents, {
    ref: ref => {
      this.setRootRef(ref);
      this.props['__react__vue__setRef'] && this.props['__react__vue__setRef'](ref);
    },
    className: (' ' + (this.props.className || '')).trim()
  }), __react__vue__createElement('h2', {
    id: "icon-tu-biao"
  }, __react__vue__createElement('a', {
    href: "#icon-tu-biao",
    ariaHidden: "true",
    className: "header-anchor".trim()
  }, `¶`), ` Icon 图标`), __react__vue__createElement('p', null, `提供了一套常用的图标集合。`), __react__vue__createElement('h3', {
    id: "shi-yong-fang-fa"
  }, __react__vue__createElement('a', {
    href: "#shi-yong-fang-fa",
    ariaHidden: "true",
    className: "header-anchor".trim()
  }, `¶`), ` 使用方法`), __react__vue__createElement('p', null, `直接通过设置类名为 `, __react__vue__createElement('code', null, `el-icon-iconName`), ` 来使用即可。例如：`), __react__vue__createElement(vm.$options.components['DemoBlock'], {
    jsfiddle: {
      "html": "<i class=\"el-icon-edit\"></i>\n<i class=\"el-icon-share\"></i>\n<i class=\"el-icon-delete\"></i>\n<el-button type=\"primary\" icon=\"search\">搜索</el-button>\n\n",
      "script": null,
      "style": null
    },
    className: "demo-box".trim()
  }, __react__vue__createElement('div', {
    'data-slot': "source",
    className: "source".trim()
  }, __react__vue__createElement('i', {
    className: "el-icon-edit".trim()
  }), __react__vue__createElement('i', {
    className: "el-icon-share".trim()
  }), __react__vue__createElement('i', {
    className: "el-icon-delete".trim()
  }), __react__vue__createElement(vm.$options.components['ElButton'], {
    type: "primary",
    icon: "search"
  }, `搜索`)), __react__vue__createElement('div', {
    'data-slot': "highlight",
    className: "highlight".trim()
  }, __react__vue__createElement('pre', null, __react__vue__createElement('code', {
    vPre: "",
    className: "language-html".trim()
  }, __react__vue__createElement('span', {
    className: "hljs-tag".trim()
  }, `<`, __react__vue__createElement('span', {
    className: "hljs-name".trim()
  }, `i`), __react__vue__createElement('span', {
    className: "hljs-attr".trim()
  }, `class`), `=`, __react__vue__createElement('span', {
    className: "hljs-string".trim()
  }, `"el-icon-edit"`), `>`), __react__vue__createElement('span', {
    className: "hljs-tag".trim()
  }, `</`, __react__vue__createElement('span', {
    className: "hljs-name".trim()
  }, `i`), `>`), __react__vue__createElement('span', {
    className: "hljs-tag".trim()
  }, `<`, __react__vue__createElement('span', {
    className: "hljs-name".trim()
  }, `i`), __react__vue__createElement('span', {
    className: "hljs-attr".trim()
  }, `class`), `=`, __react__vue__createElement('span', {
    className: "hljs-string".trim()
  }, `"el-icon-share"`), `>`), __react__vue__createElement('span', {
    className: "hljs-tag".trim()
  }, `</`, __react__vue__createElement('span', {
    className: "hljs-name".trim()
  }, `i`), `>`), __react__vue__createElement('span', {
    className: "hljs-tag".trim()
  }, `<`, __react__vue__createElement('span', {
    className: "hljs-name".trim()
  }, `i`), __react__vue__createElement('span', {
    className: "hljs-attr".trim()
  }, `class`), `=`, __react__vue__createElement('span', {
    className: "hljs-string".trim()
  }, `"el-icon-delete"`), `>`), __react__vue__createElement('span', {
    className: "hljs-tag".trim()
  }, `</`, __react__vue__createElement('span', {
    className: "hljs-name".trim()
  }, `i`), `>`), __react__vue__createElement('span', {
    className: "hljs-tag".trim()
  }, `<`, __react__vue__createElement('span', {
    className: "hljs-name".trim()
  }, `el-button`), __react__vue__createElement('span', {
    className: "hljs-attr".trim()
  }, `type`), `=`, __react__vue__createElement('span', {
    className: "hljs-string".trim()
  }, `"primary"`), __react__vue__createElement('span', {
    className: "hljs-attr".trim()
  }, `icon`), `=`, __react__vue__createElement('span', {
    className: "hljs-string".trim()
  }, `"search"`), `>`), `搜索`, __react__vue__createElement('span', {
    className: "hljs-tag".trim()
  }, `</`, __react__vue__createElement('span', {
    className: "hljs-name".trim()
  }, `el-button`), `>`))))), __react__vue__createElement('h3', {
    id: "tu-biao-ji-he"
  }, __react__vue__createElement('a', {
    href: "#tu-biao-ji-he",
    ariaHidden: "true",
    className: "header-anchor".trim()
  }, `¶`), ` 图标集合`), __react__vue__createElement('ul', {
    className: "icon-list".trim()
  }, __react__vue__renderList(vm['icons'], function(name) {
    return __react__vue__createElement('li', {
      key: name
    }, __react__vue__createElement('span', null, __react__vue__createElement('i', {
      className: __react__vue__bindClass('el-icon-' + name).trim()
    }), `${__react__vue__toString('el-icon-' + name)}`));
  }.bind(this))));
}