require("!!style-loader!css-loader!../lib/style-compiler/index?{\"vue\":true,\"id\":\"data-v-78b356af\",\"scoped\":false,\"hasInlineConfig\":false}!../lib/selector?type=styles&index=0!./vue.md");

var render = require("!!babel-loader!../lib/utils/output-file?{\"output\":\"\",\"type\":\"render\"}!../lib/template-compiler/index?{\"id\":\"data-v-78b356af\",\"scoped\":false}!../lib/selector?type=template&index=0!./vue.md").default;

var options = require("!!babel-loader!../lib/utils/output-file?{\"output\":\"\",\"type\":\"options\"}!../lib/selector?type=script&index=0!./vue.md");
options = options.default || options;

var build = require("!!babel-loader!../lib/utils/output-file?{\"output\":\"\",\"type\":\"component\"}!../lib/script-compiler/index?{\"name\":\"vue\",\"vue\":\"./index.js\"}!../lib/selector?type=script&index=0!./vue.md").default;

var Component = build(render, Object.assign({}, options, {
  __file: "/Users/smallcomfort/Desktop/study/vue-loader/dev/vue.md"
}));

module.exports = Component;