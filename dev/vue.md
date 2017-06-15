<template><section>

<h2 id="icon-tu-biao"><a class="header-anchor" href="#icon-tu-biao" aria-hidden="true">¶</a> Icon 图标</h2>
<p>提供了一套常用的图标集合。</p>
<h3 id="shi-yong-fang-fa"><a class="header-anchor" href="#shi-yong-fang-fa" aria-hidden="true">¶</a> 使用方法</h3>
<p>直接通过设置类名为 <code v-pre="">el-icon-iconName</code> 来使用即可。例如：</p>
<demo-block class="demo-box" :jsfiddle="{&quot;html&quot;:&quot;&lt;i class=\&quot;el-icon-edit\&quot;&gt;&lt;/i&gt;\n&lt;i class=\&quot;el-icon-share\&quot;&gt;&lt;/i&gt;\n&lt;i class=\&quot;el-icon-delete\&quot;&gt;&lt;/i&gt;\n&lt;el-button type=\&quot;primary\&quot; icon=\&quot;search\&quot;&gt;搜索&lt;/el-button&gt;\n\n&quot;,&quot;script&quot;:null,&quot;style&quot;:null}">
                    <div class="source" slot="source"><i class="el-icon-edit"></i>
<i class="el-icon-share"></i>
<i class="el-icon-delete"></i>
<el-button type="primary" icon="search">搜索</el-button>

</div>
                    
                    <div class="highlight" slot="highlight"><pre v-pre=""><code v-pre="" class="language-html"><span class="hljs-tag">&lt;<span class="hljs-name">i</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"el-icon-edit"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">i</span>&gt;</span>
<span class="hljs-tag">&lt;<span class="hljs-name">i</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"el-icon-share"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">i</span>&gt;</span>
<span class="hljs-tag">&lt;<span class="hljs-name">i</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"el-icon-delete"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">i</span>&gt;</span>
<span class="hljs-tag">&lt;<span class="hljs-name">el-button</span> <span class="hljs-attr">type</span>=<span class="hljs-string">"primary"</span> <span class="hljs-attr">icon</span>=<span class="hljs-string">"search"</span>&gt;</span>搜索<span class="hljs-tag">&lt;/<span class="hljs-name">el-button</span>&gt;</span>

</code></pre>
</div></demo-block>
<h3 id="tu-biao-ji-he"><a class="header-anchor" href="#tu-biao-ji-he" aria-hidden="true">¶</a> 图标集合</h3>
<ul class="icon-list">
  <li v-for="name in icons" :key="name">
    <span>
      <i :class="'el-icon-' + name"></i>
      {{'el-icon-' + name}}
    </span>
  </li>
</ul>
</section></template>
<style>
  .demo-icon .source > i {
    font-size: 24px;
    color: #8492a6;
    margin: 0 20px;
    font-size: 1.5em;
    vertical-align: middle;
  }
  
  .demo-icon .source > button {
    margin: 0 20px;
  }

  .icon-list {
    overflow: hidden;
    list-style: none;
    padding: 0;
    border: solid 1px #eaeefb;
    border-radius: 4px;
  }
  .icon-list li {
    float: left;
    width: 16.66%;
    text-align: center;
    height: 120px;
    line-height: 120px;
    color: #666;
    font-size: 13px;
    transition: color .15s linear;

    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-right: -1px;
    margin-bottom: -1px;

    @utils-vertical-center;

    & span {
      display: inline-block;
      line-height: normal;
      vertical-align: middle;
      font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',SimSun,sans-serif;
      color: #99a9bf;
    }
    & i {
      display: block;
      font-size: 24px;
      margin-bottom: 15px;
      color: #8492a6;
    }
    &:hover {
      color: rgb(92, 182, 255);
    }
  }
</style>
<script>
  var iconList = require('examples/icon.json');

  export default {
    data() {
      return {
        icons: iconList
      };
    }
  }
</script>
