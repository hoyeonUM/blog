(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{285:function(t,e,r){"use strict";r.r(e);r(42),r(23),r(19),r(12),r(28);var n=r(98),o=r(16);function c(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}function l(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?c(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):c(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}e.default={functional:!0,props:{path:{type:String,required:!0},viewBox:{type:String,default:"0 -100 1792 1792"},iconTitle:{type:String,default:""}},render:function(t,e){var data=e.data,r=e.props,o=r.viewBox,path=r.path,c=r.iconTitle;return t("svg",l(l({class:"w-8 h-8 fill-current inline-block"},data),{},{attrs:{viewBox:o,xmlns:"http://www.w3.org/2000/svg"}}),[t("path",{attrs:{d:path}})].concat(Object(n.a)(function(t,title){return title?[t("title",{},[title])]:[]}(t,c))))}}}}]);