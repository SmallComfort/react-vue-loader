# react-vue-loader 

A fork of vue-loader, use to compile the vue component into a react component.

## Install
```
npm install --save react-vue react-vue-helper
npm install --save-dev react-vue-loader
```

## Usage
One possible configuration is as follows:
```javascript
module: {
  rules: [
    {
      test: /\.vue$/,
      loader: 'react-vue-loader'
    }
  ]
}
```
[demo](https://github.com/SmallComfort/react-vue-demo)

It supports almost all configurations of [vue-loader](https://vue-loader.vuejs.org). If you have used vue-loader, in most cases you only need to change your loader configuration ```loader: 'vue-loader'``` to ```loader: 'react-vue-loader'```. Refer to the [vue-loader](https://vue-loader.vuejs.org) for detailed configuration.

### Some Difference

* react-vue-loader does not support [custom blocks](https://vue-loader.vuejs.org/en/configurations/custom-blocks.html)

* Use [react-hot-loader](https://github.com/gaearon/react-hot-loader) to achieve hot reload

* react-vue-loader adds additional options: ```vue```, ```output```


### Additional Options

#### ```vue```
* type: ```String```

Used to import a global vue configuration. The loader will load the configuration and apply it to each vue component.

```javascript
// vue.config.js
import Vue from 'react-vue';
import Vuex from 'vuex';
import VueMaterial from 'vue-material/src'

Vue.use(Vuex);
Vue.use(VueMaterial);

export default Vue;
```

```javascript
module: {
  rules: [
    {
      test: /\.vue$/,
      loader: 'react-vue-loader',
      options: {
        vue: './vue.config.js'
      }
    }
  ]
}
```

#### ```output```
* type: ```[Boolean, String]```
* default: ```false```

> Be cautious, it just creates a file and can not remove the file later, when you may want to delete one by one.

Set ```true``` to see how the vue code is compiled into the react code, which will generate four js files in the same directory. To customize the generated file name, set a string type for ```output```

```javascript
module: {
  rules: [
    {
      test: /\.vue$/,
      loader: 'react-vue-loader',
      options: {
        output: true
        // output: 'custome-name'
      }
    }
  ]
}
```


## License

[MIT](http://opensource.org/licenses/MIT)
