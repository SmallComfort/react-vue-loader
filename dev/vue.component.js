import Vue, {
  observer
} from 'react-vue'

import {
  Component
} from 'react'

import PropTypes from 'prop-types'

import {
  buildComponent,
  platformDirectives
} from 'react-vue-helper'
import VueConfiger from "../index.js"
export default (render, options, cssModules) => {
  return observer(
    class Vue extends buildComponent(
      render, Object.assign({}, {
        directives: platformDirectives
      }, options), {
        Component,
        PropTypes,
        Vue,
        cssModules,
        VueConfiger
      }
    ) {}
  )
}