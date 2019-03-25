var __extends=this&&this.__extends||function(){var r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o])};return function(e,t){function o(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)}}(),__decorate=this&&this.__decorate||function(e,t,o,r){var i,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,o,r);else for(var a=e.length-1;0<=a;a--)(i=e[a])&&(s=(n<3?i(s):3<n?i(t,o,s):i(t,o))||s);return 3<n&&s&&Object.defineProperty(t,o,s),s};define(["require","exports","esri/core/tsSupport/declareExtendsHelper","esri/core/tsSupport/decorateHelper","../context/Context","../context/Topic","esri/core/accessorSupport/decorators","esri/widgets/support/widget","esri/widgets/Widget"],function(e,t,o,r,i,n,s,a,l){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var c="i-toast",u="i-toast-icon",p=function(t){function e(e){var o=t.call(this)||this;return o.delayMillis=3e3,o.message=null,o._timeout=null,o._type=null,o.own(n.default.subscribe(n.default.ShowToast,function(e){var t=o.delayMillis;"number"==typeof e.delayMillis&&(t=e.delayMillis),o.clearTimeout(),o._type=e.type,o.message=e.message,o._timeout=setTimeout(function(){o.message=null},t)})),o}return o(e,t),e.prototype.postInitialize=function(){this.checkBrowser()},e.prototype.clearTimeout=function(){clearTimeout(this._timeout),this._timeout=null},e.prototype.checkBrowser=function(){var t=this;if(i.default.getInstance().isKiosk){var e=function(){var e=window.orientation;"number"==typeof e&&(0===e||180===e?n.default.publish(n.default.ShowToast,{message:i.default.getInstance().i18n.messages.rotateToLandscape,type:"danger",delayMillis:5e3}):-90!==e&&90!==e||(t.clearTimeout(),t.message=null))},o=void 0;"onorientationchange"in window&&(o="orientationchange"),o&&window.addEventListener(o,function(){e()}),e()}},e.prototype.render=function(){var e=this.message;if("string"==typeof e&&0<e.length){var t=this._type,o="information-16";"danger"===t?o="exclamation-mark-triangle-16":t="info";var r="libs/calcite-ui-icons/icons/sprite-16.svg#"+o,i=c+" "+t;return a.tsx("div",{key:"i-toast",class:i,role:"alert"},a.tsx("svg",{class:u},a.tsx("use",{href:r})),a.tsx("span",null,e))}return null},r([s.property()],e.prototype,"delayMillis",void 0),r([s.property(),a.renderable()],e.prototype,"message",void 0),e=r([s.subclass("app.main.Toast")],e)}(s.declared(l));t.default=p});